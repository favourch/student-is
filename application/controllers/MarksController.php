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

		//get the list of the students that we need
		$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
								->leftJoin("marks", "students.id = marks.student_id")
								->where('students.client_id = ?', $this->client_id)
								->where('students.archived != ?', true)
								->where('students.class_id = ?', Input::get('class'))
								->where('students.stream_id = ?', Input::get('stream'))
								->all();

		View::renderJSON($students->result_array());
		
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

		//get the list of all the students
		$students = StudentModel::select(array("id","reg_number","first_name","middle_name","last_name"))
								->where('client_id = ?', $this->client_id)
								->where('archived != ?', true)
								->where('class_id = ?', Input::get('class'))
								->where('stream_id = ?', Input::get('stream'))
								->all()
								->result();
		$marks = MarkModel::select(array("student_id","exam_id","exam_percent"))
						->where('client_id = ?', $this->client_id)
						->where('archived != ?', true)
						->where('class_id = ?', Input::get('class'))
						->where('subject_id = ?', Input::get('subject'))
						->where('stream_id = ?', Input::get('stream'))
						->where('term_id = ?', Input::get('term'))
						->where('exam_year = ?', Input::get('year'))
						->all()
						->result();

		$studentsList = array();

		//populate the class list of students with ma
		foreach ($students as $key => $stud) {
			$studentsList["ID".$stud->id] = array(
					"student_id" => $stud->id,
					"reg_number" => $stud->reg_number,
					"first_name" => $stud->first_name,
					"middle_name" => $stud->middle_name,
					"last_name" => $stud->last_name,
					"exams" => array()
				);
		}

		//go through the list of available marks and add to each student
		foreach ($marks as $key => $mark) {
			$studentsList["ID".$mark->student_id]["exams"][] = $mark;
		}

		View::renderJSON($studentsList);

	}

}