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
		$students = StudentModel::where('client_id = ?', $this->client_id)
								->where('archived != ?', true)
								->where('class_id = ?', Input::get('class'))
								->where('stream_id = ?', Input::get('stream'))
								->limit(20)
								->all();
		//check if there are students for this query
		if ($students->num_rows() > 0) {

			$marks = array();

			//loop though the students array fetching marks for each
			foreach ($students->result() as $student) {
				//get the marks for this exam
				$maks = MarkModel::from(null, array("score"))
							->where('client_id = ?', $this->client_id)
							->where('archived != ?', true)
							->where('student_id = ?', $student->id)
							->where('class_id = ?', Input::get('class'))
							->where('subject_id = ?', Input::get('subject'))
							->where('exam_id = ?', Input::get('exam'))
							->where('term_id = ?', Input::get('term'))
							->where('year = ?', Input::get('year'))
							->all();

				if ($maks->num_rows() > 0) {
					$student->score = $marks->result_array()[0]['score'];
				} else {
					$student->score = null;
				}
				
				$marks[] = $student;
					
			}
			
			View::renderJSON($marks);
		} 
		//there are no student found
		else {
			View::renderJSON(array());
		}
		
	}

}