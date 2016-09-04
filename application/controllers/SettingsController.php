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
	 * The method checks for client admin login
	 * @param null
	 * @return void
	 */
	public function  authAdmin(){

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
		elseif ($tokenExists->result_array()[0]['user_role'] != 3) {
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
			$this->client = $token;

		}

	}

	/**
	 * The method checks for client regular user login
	 * @param null
	 * @return void
	 */
	public function  authUser(){

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
	
}

