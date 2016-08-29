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
use Libraries\CronLibrary\SampleCronController;
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
	 * The method checks for user authentication and authorization
	 * @param null
	 * @return void
	 */
	public function  auth(){
		$token = Input::get('token');
		$tokenExists = TokenModel::where('token = ?', $token)
									->all();

		if (!$tokenExists->num_rows()) {
			header('HTTP/1.0 403 Forbidden');
			die('Login required!');

		}
		elseif ($tokenExists->result_array()[0]['user_role'] != 1 AND $tokenExists->result_array()[0]['user_role'] != 2) {
			header('HTTP/1.0 401 Unauthorized'); 
			die('Restricted access!');
		}

	}

	/**
	 * This method loads the homepage. 
	 * @param int $id The user id
	 * @return void
	 */
	public function getIndex( $id)
	{

		$data['title'] = $this->site_title;
		$data['request_time'] = $this->request_exec_time();

		View::render('home.index',$data);

	}
	
	/**
	 * This method returns a list of all clients in the database
	 * @before auth
	 * @param string $token The access token string
	 * @return JSON object of clients
	 */
	public function getAddClient($token){

		$clients = ClientModel::all();
		View::renderJSON($clients->result_array());
		
	}
	/**
	 * This method adds a new client to the database
	 * @before auth
	 * @param string $token The token to authenticate request
	 * @return JSON
	 */
	public function postAddClient($token){

		$client = json_decode($_POST['model']);
		
		$client = array(
			'institution' => $client->institution,
			'first_name' => $client->first_name,
			'last_name' => $client->last_name,
			'phone' => $client->phone,
			'email' => $client->email,
			'address' => $client->address,
			'code' => $client->code,
			'city' => $client->city
		);

		$create = ClientModel::save($client);
		$new = ClientModel::getById($create->lastInsertId());
		
		View::renderJSON($new->result_array()[0]);

	}
	
	/**
	 * This  methods returns all the users in the database
	 * @before auth
	 * @param string $token The access token
	 * @return JSON
	 */
	public function getAddUser($token){

		$users = UserModel::all();
		View::renderJSON($users->result_array());

	}
	/**
	 * This method adds a new user to the database
	 * @before auth
	 * @param string $token The token to authenticate request
	 * @return JSON
	 */
	public function postAddUser($token){
		
		$user = json_decode($_POST['model']);
		
		$client = array(
			'first_name' => $user->first_name,
			'last_name' => $user->last_name,
			'password' => md5($user->password),
			'email' => $user->email,			
			'user_role' => $user->user_type
		);

		$create = UserModel::save($client);
		$new = UserModel::getById($create->lastInsertId());
		
		View::renderJSON($new->result_array()[0]);	
	}

}

