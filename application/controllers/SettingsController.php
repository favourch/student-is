<?php namespace Controllers;

/**
 *This controller creates user settings
 *@author Geoffrey Bans <geoffreybans@gmail.com>
 *@copyright 2015 - 2020 Geoffrey Bans
 *@category Controllers
 *@package Controllers\Settings
 *@link https://github.com/geoffreybans/student-is
 *@license http://opensource.org/licenses/MIT MIT License
 *@version 1.0.1
 */

use Drivers\Templates\View;
use Models\UserModel;
use Models\ClassModel;
use Models\TokenModel;
use Models\ClientModel;
use Models\StudentModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class SettingsController extends BaseController {

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = true;

	/**
	 * @var int The client_id for this student
	 */
	protected $client_id = null; 

	/**
	 * @var array The information about this client admin
	 */
	protected $client = array();

	/**
	 * This method returns a list of all users for this client in the database
	 * @before authAdmin
	 * @param null
	 * @return JSON object of users
	 */
	public function getUsers(){

		$users = StudentModel::where('client_id = ?', $this->client_id)
					->all();
		View::renderJSON($users->result_array());
		
	}
	/**
	 * This method adds a new user for a client to the database
	 * @before authAdmin
	 * @param null
	 * @return JSON
	 */
	public function postUsers(){

		$user = json_decode($_POST['model']);
		$password = substr(md5(uniqid(mt_rand(), true)), 0, 8);
		
		$newUser = array(
			'first_name' => $user->first_name,
			'last_name' => $user->last_name,
			'password' => md5(sha1($password)),
			'email' => $user->email,			
			'user_role' => 4,
			'client_id' => $this->client_id
		);

		$create = UserModel::save($newUser);

		// The message
		$message = "Hello {$user->first_name} {$user->last_name} your account for Student Infomation System software has been created by {$this->client['first_name']} {$this->client['last_name']} .\r\n";
		$message += "Email: {$user->email} \r\n Password: $password\r\n  You can login using this link Url::base()";
		$headers = "From: geoffreybans@gmail.com \r\n Reply-To: {$this->client['email']} \r\n X-Mailer: PHP/ phpversion()";
		// In case any of our lines are larger than 70 characters, we should use wordwrap()
		$message = wordwrap($message, 70, "\r\n");
		// Send email
		mail($user->email, 'Student IS - Account Created', $message, $headers);
		
		$new = UserModel::getById($create->lastInsertId());
		View::renderJSON($new->result_array()[0]);	
		
	}

	/**
	 * This methods gets all classes in the database for this client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getClasses(){
		$classes = ClassModel::where('client_id = ?', $this->client_id)
							->all();
		View::renderJSON($classes->result_array());
	}	

	/**
	 * This methods creates/updates/deletes all classes in the database for this client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function postClasses(){
		
		$class = json_decode($_POST['model']);		
		$newClass = array(
			'name' => $class->name,
			'streams' => $class->streams,
			'subjects' => $class->subjects,
			'exams' => $class->exams,			
			'client_id' => $this->client_id
		);

		$create = ClassModel::save($newClass);
		$new = ClassModel::getById($create->lastInsertId());
		View::renderJSON($new->result_array()[0]);	
	}
	
}

