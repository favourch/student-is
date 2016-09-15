<?php namespace Controllers;

/**
 *This class loads the application homepage
 *@author Geoffrey Oliver <geoffreybans@gmail.com>
 *@copyright 2015 - 2020 Geoffrey Bans
 *@category Controllers
 *@package Controllers\Admin
 *@link https://github.com/geoffreybans/student-is
 *@license http://opensource.org/licenses/MIT MIT License
 *@version 1.0.1
 */

use Drivers\Templates\View;
use Models\UserModel;
use Models\TokenModel;
use Models\ClientModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class AdminController extends BaseController {

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = true;

	/**
	 * This method returns a list of all clients in the database
	 * @before authSiteUser
	 * @param null
	 * @return JSON object of clients
	 */
	public function getClients(){

		$clients = ClientModel::all();
		View::renderJSON($clients->result_array());
		
	}
	/**
	 * This method adds a new client to the database
	 * @before authSiteUser
	 * @param null
	 * @return JSON
	 */
	public function postClients(){

		$client = json_decode($_POST['model']);
		
		//create new client
		$newclient = array(
			'school_name' => $client->institution,
			'first_name' => $client->first_name,
			'last_name' => $client->last_name,
			'phone' => $client->phone,
			'email' => $client->email,
			'address' => $client->address,
			'code' => $client->code,
			'city' => $client->city
		);

		$create = ClientModel::save($newclient);
		$clientId = $create->lastInsertId();

		$password = substr(md5(uniqid(mt_rand(), true)), 0, 8);

		//create user for new client
		UserModel::save(array(
			'first_name' => $client->first_name,
			'last_name' => $client->last_name,
			'email' => $client->email,
			'password' => md5(sha1($password)),
			'client_id' => $clientId,
			'activated' => true,
			'user_role' => 3
			)
		);

		$url = Url::base();
		// The message
		$message = "Hello {$client->first_name} {$client->last_name} your account for Student Infomation System software has been created succeddfully.\r\n";
		$message .= "Email: {$client->email} \r\n Password: $password\r\n Institution: $client->institution\r\n  You can login using this link {$url}";
		$headers = "From: geoffreybans@gmail.com \r\n Reply-To: geoffreybans@gmail.com \r\n X-Mailer: PHP/ phpversion()";

		// In case any of our lines are larger than 70 characters, we should use wordwrap()
		$message = wordwrap($message, 70, "\r\n");

		// Send email
		mail($client->email, 'Student IS - Account Created', $message, $headers);

		$new = ClientModel::getById($create->lastInsertId());
		View::renderJSON($new->result_array()[0]);

	}
	
	/**
	 * This  methods returns all the users in the database
	 * @before authSiteUser
	 * @param null
	 * @return JSON
	 */
	public function getUsers(){

		$users = UserModel::all();
		View::renderJSON($users->result_array());

	}
	/**
	 * This method adds a new user to the database
	 * @before authSiteUser
	 * @param null
	 * @return JSON
	 */
	public function postUsers(){
		
		$user = json_decode($_POST['model']);
		
		$client = array(
			'first_name' => $user->first_name,
			'last_name' => $user->last_name,
			'password' => md5(sha1($user->password)),
			'email' => $user->email,			
			'activated' => true,			
			'user_role' => 2
		);

		$create = UserModel::save($client);

		// The message
		$message = "Hello {$user->first_name} {$user->last_name} your account for Student Infomation System software has been created.\r\n";
		$message .= "Email: {$user->email} \r\n Password: $user->password\r\n  You can login using this link Url::base()";
		$headers = "From: geoffreybans@gmail.com \r\n Reply-To: geoffreybans@gmail.com \r\n X-Mailer: PHP/ phpversion()";
		// In case any of our lines are larger than 70 characters, we should use wordwrap()
		$message = wordwrap($message, 70, "\r\n");
		// Send email
		mail($user->email, 'Student IS - Account Created', $message, $headers);
		
		$new = UserModel::getById($create->lastInsertId());
		View::renderJSON($new->result_array()[0]);	
	}

}

