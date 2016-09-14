<?php namespace Controllers;

/**
 *This class registers new students into the database
 *@author Geoffrey Band <geoffreybans@gmail.com>
 *@copyright 2015 - 2020 Geoffrey Bans
 *@category Controllers
 *@package Controllers\Admissions
 *@link https://github.com/geoffreybans/student-is
 *@license http://opensource.org/licenses/MIT MIT License
 *@version 1.0.1
 */

use Drivers\Templates\View;
use Models\UserModel;
use Models\TokenModel;
use Models\ClientModel;
use Models\StudentModel;
use Models\StreamModel;
use Models\SubjectModel;
use Models\ClassModel;
use Models\ExamModel;
use Models\MarkModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class MarksController extends BaseController {

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = true;

	/**
	 * @var int The client_id for this student
	 */
	protected $client_id = null; 

	/**
	 * @var array The information about this client
	 */
	protected $client = array();

	/**
	 * This method returns a list of students with marks for this exams
	 * @before authClientUser
	 * @param null
	 * @return JSON object of student marks
	 */
	public function getMarks(){

		if(Input::get('stream')){
			//get the list of the students that we need
			$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
									->where('client_id = ?', $this->client_id)
									->where('archived != ?', true)
									->where('class_id = ?', Input::get('class'))
									->where('students.stream_id = ?', Input::get('stream'))
									->all()
									->result();	
		}
		else{
			//get the list of the students that we need
			$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
									->where('client_id = ?', $this->client_id)
									->where('archived != ?', true)
									->where('class_id = ?', Input::get('class'))
									->all()
									->result();		
		}

		$marks = MarkModel::select(array("student_id","exam_id","exam_score","exam_percent"))
						->where('client_id = ?', $this->client_id)
						->where('archived != ?', true)
						->where('class_id = ?', Input::get('class'))
						->where('subject_id = ?', Input::get('subject'))
						->where('exam_id = ?', Input::get('exam'))
						->where('term_id = ?', Input::get('term'))
						->where('exam_year = ?', Input::get('year'))
						->all()
						->result();

		$studentsList = array();

		//populate the class list of students with marks
		foreach ($students as $key => $stud) {
			$studentsList["ID".$stud->id] = array(
					"student_id" => $stud->id,
					"reg_number" => $stud->reg_number,
					"first_name" => $stud->first_name,
					"middle_name" => $stud->middle_name,
					"last_name" => $stud->last_name,
					"exam_score" => null,
					"exam_percent" => null
				);
		}

		//go through the list of available marks and add to each student
		foreach ($marks as $key => $mark) {
			if(isset($studentsList["ID".$mark->student_id])){
				$studentsList["ID".$mark->student_id]["exam_score"] = $mark->exam_score;
				$studentsList["ID".$mark->student_id]["exam_percent"] = $mark->exam_percent;			
			}	
		}

		//populate array list to return
		$studentMarks = array();
		foreach ($studentsList as $key => $student) {
			$studentMarks[] = $student;
		}

		View::renderJSON($studentMarks);		
	}

	/**
	 * This method lists all marks entries for a particular subject
	 * @before authClientUser
	 * @param null
	 * @return JSON object
	 */
	public function getMarklist(){
		//get the exams for this subject
		$exams = ExamModel::where('client_id = ?', $this->client_id)
							->where('class_id = ?', Input::get('class'))
							->all()
							->result();
		//get students by streams
		if(Input::get('stream')){
			//get the list of all the students
			$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
									->where('client_id = ?', $this->client_id)
									->where('archived != ?', true)
									->where('class_id = ?', Input::get('class'))
									->where('stream_id = ?', Input::get('stream'))
									->all()
									->result();
		}
		else{
			//get the list of all the students
			$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
									->where('client_id = ?', $this->client_id)
									->where('archived != ?', true)
									->where('class_id = ?', Input::get('class'))
									->all()
									->result();
		}

		$marks = MarkModel::select(array("student_id","exam_id","exam_percent"))
						->where('client_id = ?', $this->client_id)
						->where('archived != ?', true)
						->where('class_id = ?', Input::get('class'))
						->where('subject_id = ?', Input::get('subject'))
						->where('term_id = ?', Input::get('term'))
						->where('exam_year = ?', Input::get('year'))
						->all()
						->result();

		$studentsList = array();

		//populate the class list of students with marks
		foreach ($students as $key => $stud) {
			$studentsList["ID".$stud->id] = array(
					"student_id" => $stud->id,
					"reg_number" => $stud->reg_number,
					"first_name" => $stud->first_name,
					"middle_name" => $stud->middle_name,
					"last_name" => $stud->last_name,
					"reg_exams" => (array)$exams,
					"exams" => array(),
					"average" => null
				);
		}

		//go through the list of available marks and add to each student
		foreach ($marks as $key => $mark) {
			$studentsList["ID".$mark->student_id]["exams"][] = (array)$mark;
		}

		//list of list of students computing averages
		foreach ($studentsList as $keyID => $student) {
			
			if(count($student['exams']) > 0){
				$examsTotal = 0;
				foreach ($student['exams'] as $key => $exam) {
					$examsTotal += $exam['exam_percent'];
				}
				$average = round($examsTotal / count($exams));
				$studentsList["ID".$keyID]["average"][] = $average;

			}

		}

		//populate array list to return
		$marklist = array();
		foreach ($studentsList as $key => $student) {
			$marklist[] = $student;
		}

		View::renderJSON($marklist);

	}

	/**
	 * This method generates spreadsheet for ranking students
	 * @before authClientUser
	 * @param null
	 * @return JSON object
	 */
	public function getSpreadsheet(){

		//get the exams for this class
		$exams = ExamModel::where('client_id = ?', $this->client_id)
							->where('class_id = ?', Input::get('class'))
							->count()
							->num_rows();

		//get the list of all the students
		$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
								->where('client_id = ?', $this->client_id)
								->where('archived != ?', true)
								->where('class_id = ?', Input::get('class'))
								->where('stream_id = ?', Input::get('stream'))
								->all()
								->result();
		//get the array of all marks entries for this term
		$marks = MarkModel::select(array("student_id","exam_id","exam_percent","subject_id"))
						->where('client_id = ?', $this->client_id)
						->where('archived != ?', true)
						->where('class_id = ?', Input::get('class'))
						->where('term_id = ?', Input::get('term'))
						->where('exam_year = ?', Input::get('year'))
						->all()
						->result();

		//get the list of subjects for this class
		$subjects = SubjectModel::select(array("id"))
						->where('client_id = ?', $this->client_id)
						->where('class_id = ?', Input::get('class'))
						->all()
						->result();

		$studentsList = array();

		//populate the class list of students with marks
		foreach ($students as $key => $stud) {
			$studentsList["ID".$stud->id] = array(
					"student_id" => $stud->id,
					"reg_number" => $stud->reg_number,
					"first_name" => $stud->first_name,
					"middle_name" => $stud->middle_name,
					"last_name" => $stud->last_name,
					"reg_exams" => (array)$exams,
					"exams" => array(),
					"total" => 0,
					"average" => 0
				);
		}	

		//loop through the marks array populating the students list with marks
		foreach ($marks as $key => $mark) {
			$studentsList["ID".$mark->student_id]['exams'][] = $mark;
		}

		//loop through the marks adding each subject together
		foreach ($studentsList as $studID => $student) {
			$studentsList[$studID]['exams'] = array();
			$totalScore = 0;
			foreach ($subjects as $subID => $subject) {
				$subjectTotal = null;
				$average = null;
				foreach ($student['exams'] as $examID => $exam) {
					if ($exam->subject_id == $subject->id) {

						//check if a previous value has been added
						if ($subjectTotal == null) {
							$subjectTotal = 0;
						}
						$subjectTotal += $exam->exam_percent;
					}
				}

				//check if this subject is invalid for this student
				if ($subjectTotal !== null) {
					$average = 0;
					$average = round($subjectTotal / $exams);
				}
				
				$studentsList[$studID]['exams'][] = array(
						"subject_id" => $subject->id,
						"exam_percent" => $average
					);
				$totalScore += $average;
			}
			$studentsList[$studID]["total"] = $totalScore;
		}

		//get student list of arrays and then return
		$studList = array();
		foreach ($studentsList as $key => $student) {
			$studList[] = $student;
		}
		View::renderJSON($studList);

	}

	/**
	 * This method generates report forms for all students
	 * @before authClientUser
	 * @param null
	 * @return JSON object
	 */
	public function getReports(){

		//get the exams for this class
		$exams = ExamModel::where('client_id = ?', $this->client_id)
							->where('class_id = ?', Input::get('class'))
							->count()
							->num_rows();

		//get the list of all the students
		$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
								->where('client_id = ?', $this->client_id)
								->where('archived != ?', true)
								->where('class_id = ?', Input::get('class'))
								->where('stream_id = ?', Input::get('stream'))
								->all()
								->result();
		//get the array of all marks entries for this term
		$marks = MarkModel::select(array("student_id","exam_id","exam_percent","subject_id"))
						->where('client_id = ?', $this->client_id)
						->where('archived != ?', true)
						->where('class_id = ?', Input::get('class'))
						->where('term_id = ?', Input::get('term'))
						->where('exam_year = ?', Input::get('year'))
						->all()
						->result();

		//get the list of subjects for this class
		$subjects = SubjectModel::select(array("id"))
						->where('client_id = ?', $this->client_id)
						->where('class_id = ?', Input::get('class'))
						->all()
						->result();

		$studentsList = array();

		//populate the class list of students with marks
		foreach ($students as $key => $stud) {
			$studentsList["ID".$stud->id] = array(
					"student_id" => $stud->id,
					"reg_number" => $stud->reg_number,
					"first_name" => $stud->first_name,
					"middle_name" => $stud->middle_name,
					"last_name" => $stud->last_name,
					"exams" => (array)$exams,
					"marks" => array(),
					"total" => 0,
					"average" => null
				);
		}	

		//loop through the marks array populating the students list with marks
		foreach ($marks as $key => $mark) {
			$studentsList["ID".$mark->student_id]['marks'][] = $mark;
		}

		//loop through the marks adding each subject together
		foreach ($studentsList as $key => $student) {
			//
			$studentsList[$key]['exams'] = array();
			$totalScore = 0;
			foreach ($subjects as $key => $subject) {
				$subjectTotal = 0;
				foreach ($student['exams'] as $key => $exam) {
					if ($exam->subject_id == $subject->id) {
						$subjectTotal += $exam->exam_percent;
					}
				}
				$average = round($total / $exams);
				$studentsList[$key]['exams'][] = array(
						"subject_id" => $subject->id,
						"exam_percent" => $average
					);
				$total += $average;
			}
			$studentsList[$key]["total"] = $totalScore;
		}

	}

}