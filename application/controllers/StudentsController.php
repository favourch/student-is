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
	 * The method checks for user authentication and authorization
	 * @param null
	 * @return void
	 */
	public function  auth(){

		$token = Input::get('token');
		$tokenExists = TokenModel::where('token = ?', $token)
									->all();
		//invalid token used/no access token provided
		if (!$tokenExists->num_rows()) {		 
			header('HTTP/1.0 403 Forbidden');
			die('Login required!1');
		}
		//check for expired token
		elseif ($tokenExists->result_array()[0]['logout'] === true) {
			header('HTTP/1.0 403 Forbidden');
			die('Login required!2');
		}
		//unathorized user access to admin controller
		elseif ($tokenExists->result_array()[0]['user_role'] != 3 AND $tokenExists->result_array()[0]['user_role'] != 4) {
			header('HTTP/1.0 401 Unauthorized'); 
			die('Restricted access!');
		}
		else {
			//check for expired timestamp
			$token = $tokenExists->result_array()[0];
			$timestamp = strtotime($token['date_modified'] OR $token['date_created']);

			if (($timestamp + $token['duration']) > time()) {
				header('HTTP/1.0 403 Forbidden');
				die('Login required!3');
			}

			//extend token lifespan
			TokenModel::where('id = ?', $token['id'])
						->save(array(
							'duration' => 3600
							)
						);

			//set the value of the client id
			$this->client_id = $token['client_id'];

		}

	}

	/**
	 * This method returns a list of all students in the database
	 * @before auth
	 * @param null
	 * @return JSON object of students
	 */
	public function getStudents(){

		$students = StudentModel::all();
		View::renderJSON($students->result_array());
		
	}
	/**
	 * This method adds a new client to the database
	 * @before auth
	 * @param null
	 * @return JSON
	 */
	public function postStudents(){

		$student = json_decode($_POST['model']);
		
		$student = array(
			'first_name' => $student->first_name,
			'middle_name' => $student->middle_name,
			'last_name' => $student->last_name,
			'dob' => $student->dob,
			'pob' => $student->pob,
			'bcn' => $student->bcn,
			'sex' => $student->sex,
			'nationality' => $student->nationality,
			'doa' => $student->doa,
			'class' => $student->class,
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
	
}

