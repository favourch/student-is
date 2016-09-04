<?php namespace Controllers;

/**
 * This is the base controller from which all named controllers derive by extending.
 * @author Geoffrey Oliver <geoffrey.oliver2@gmail.com>
 * @copyright 2015 - 2020 Geoffrey Oliver
 * @category Controllers
 * @package Controllers\BaseController
 * @link https://github.com/gliver-mvc/gliver
 * @license http://opensource.org/licenses/MIT MIT License
 * @version 1.0.1
 */

use Drivers\Controllers\BaseControllerTrait;
use Helpers\Input\Input;
use Models\TokenModel;

class BaseController {

	//call the trait with the setter/getter methods
	use BaseControllerTrait;

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = false;

	/**
	 * The method checks for site admin login
	 * @param null
	 * @return void
	 */
	public function  authSiteAdmin(){

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
		elseif ($tokenExists->result_array()[0]['user_role'] != 1 ) {
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
		}

	}	

	/**
	 * The method checks for site admin user
	 * @param null
	 * @return void
	 */
	public function  authSiteUser(){

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
		elseif ($tokenExists->result_array()[0]['user_role'] != 1 AND $tokenExists->result_array()[0]['user_role'] != 2) {
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
		}

	}
	/**
	 * The method checks for client admin login
	 * @param null
	 * @return void
	 */
	public function  authClientAdmin(){

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
	public function  authClientUser(){

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

}