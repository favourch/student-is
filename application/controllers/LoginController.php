<?php namespace Controllers;

/**
 *This controller handles user authentication
 *@author Geoffrey Oliver <geoffrey.oliver2@gmail.com>
 *@copyright 2015 - 2020 Geoffrey Oliver
 *@category Controllers
 *@package Controllers\Home
 *@link https://github.com/geoffreybans/student-is
 *@license http://opensource.org/licenses/MIT MIT License
 *@version 1.0.1
 */

use Drivers\Templates\View;
use Libraries\CronLibrary\SampleCronController;
use Models\UserModel;
use Models\TokenModel;
use Models\ClientModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class LoginController extends BaseController {

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = false;
	
	/**
	 * This method performs user authentication
	 * @param string $email The user email
	 * @param string $password The use password
	 * @return JSON authentication results
	 * @throws null This  method does not throw an error
	 */
	public function checkuser($email, $password){
		
		$user = UserModel::where("email = ?", Input::get('email'))
							->where("password = ?", md5(sha1(Input::get('password'))))
							->first();



		if ($user->num_rows() > 0) {
			
			$user = $user->result_array()[0];

			//check for active user account
			if ($user['activated'] == true) {

				//get client info
				$client = ClientModel::where('id = ?', $user['client_id'])
									->first();
				$client = $client->result_array()[0];

				//check for active client account
				if ($client['activated'] == true) {

					$token = sha1(md5($user['email'] + time()));

					TokenModel::save(array(
						'email' => $user['email'],
						'first_name' => $user['first_name'],
						'last_name' => $user['last_name'],
						'client_id' => $user['client_id'],
						'token' => $token,
						'duration' => 3600,
						'user_role' => $user['user_role']
						)
					);

					View::renderJSON(array(
						"user" => array(
							'email' => $user['email'],
							'first_name' => $user['first_name'],
							'last_name' => $user['last_name'],
							'user_role' => $user['user_role']
							),
						"token" => $token,
						"client" => array(
							"name" => $client['institution'],
							"email" => $client['email'],
							"phone" => $client['phone'],
							"activated" => $client['activated']
							)
						)
					);				
				} 
				//deactivated client account
				else {
					
				}
							
			} 
			//account needs activation
			else {
				

			}
			
		}
		else {
			View::renderJSON(array("error" => "Invalid username or password supplied!"));
		}

	}

	/**
	 * This method logs out a user and makes the token invalid
	 * @param string $token The access token to log out
	 * @return void
	 */
	public function logout($token){
		if ($token) {
			$checkT = TokenModel::where('token = ?', $token)
							->first();
			if ($checkT->num_rows() > 0) {
				TokenModel::where('token = ?', $token)
						->save(array(
							'logout' => true
							)
						);
			}
		}
	}
}

