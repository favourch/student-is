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
use Helpers\Url\Url;
use Helpers\Input\Input;

class StudentsController extends BaseController {

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
	 * This method returns a list of all students in the database
	 * @before authClientUser
	 * @param null
	 * @return JSON object of students
	 */
	public function getStudents(){

		if (Input::get('class')) {
			$students = StudentModel::where('client_id = ?', $this->client_id)
								->where('archived != ?', true)
								->where('class_id = ?', Input::get('class'))
								->all();
		}
		elseif (Input::get('stream')) {
			$students = StudentModel::where('client_id = ?', $this->client_id)
								->where('archived != ?', true)
								->where('class_id = ?', Input::get('class'))
								->where('stream_id = ?', Input::get('class'))
								->all();
		else{

			$students = StudentModel::where('client_id = ?', $this->client_id)
									->where('archived != ?', true)
									->all();
		}
		
		View::renderJSON($students->result_array());
		
	}
	/**
	 * This method creates/updates/deletes a student record
	 * @before authClientUser
	 * @param int $student_id The unique for this student in the database
	 * @return JSON
	 */
	public function postStudents($student_id){

		if (!$student_id) {
			$student = json_decode($_POST['model']);
			
			$student = array(
				'reg_number' => $student->reg_number,
				'first_name' => $student->first_name,
				'middle_name' => $student->middle_name,
				'last_name' => $student->last_name,
				'dob' => $student->dob,
				'pob' => $student->pob,
				'bcn' => $student->bcn,
				'sex' => $student->sex,
				'nationality' => $student->nationality,
				'doa' => $student->doa,
				'class_id' => $student->class_id,
				'stream_id' => $student->stream_id,
				'address' => $student->address,
				'code' => $student->code,
				'town' => $student->town,
				'pg_f_name' => $student->pg_f_name,
				'pg_l_name' => $student->pg_l_name,
				'pg_email' => $student->pg_email,
				'pg_phone' => $student->pg_phone,
				'client_id' => $this->client_id
			);

			$create = StudentModel::save($student);
			$studentId = $create->lastInsertId();

			$new = StudentModel::getById($studentId);
			View::renderJSON($new->result_array()[0]);
		
		} 
		else {
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				
				$studentData = json_decode($_POST['model']);
				$updateStudent = array(				
					'reg_number' => $studentData->reg_number,
					'first_name' => $studentData->first_name,
					'middle_name' => $studentData->middle_name,
					'last_name' => $studentData->last_name,
					'dob' => $studentData->dob,
					'pob' => $studentData->pob,
					'bcn' => $studentData->bcn,
					'sex' => $studentData->sex,
					'nationality' => $studentData->nationality,
					'doa' => $studentData->doa,
					'address' => $studentData->address,
					'code' => $studentData->code,
					'town' => $studentData->town,
					'pg_f_name' => $studentData->pg_f_name,
					'pg_l_name' => $studentData->pg_l_name,
					'pg_email' => $studentData->pg_email,
					'pg_phone' => $studentData->pg_phone
				);

				StudentModel::where('client_id = ?', $this->client_id)
							->where('id = ?', $student_id)
							->save($updateStudent);

			}
			//this is a DELETE request
			else{
				//delete this user from  the DB
				StudentModel::where('client_id = ?', $this->client_id)
						->where('id = ?', $student_id)
						->delete();

			}		

		}

	}

	/** 
	 * This method returns a list of all streams for this client
	 * @before authClientUser
	 * @param null
	 * @return void
	 */
	public function getStreams(){
		$streams = StreamModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($streams->result_array());
	}	

	/** 
	 * This method returns a list of all classes for this client
	 * @before authClientUser
	 * @param null
	 * @return void
	 */
	public function getClasses(){
		$classes = ClassModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($classes->result_array());
	}
		
	/** 
	 * This method returns a list of all subjects for this client
	 * @before authClientUser
	 * @param null
	 * @return void
	 */
	public function getSubjects(){
		$subjects = SubjectModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($subjects->result_array());
	}

	/** 
	 * This method returns a list of all exams for this client
	 * @before authClientUser
	 * @param null
	 * @return void
	 */
	public function getExams(){
		$exams = ExamModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($exams->result_array());
	}
		
	/** 
	 * This method returns a list of all terms for this client
	 * @before authClientUser
	 * @param null
	 * @return void
	 */
	public function getTerms(){
		$terms = TermModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($terms->result_array());
	}
		
}

