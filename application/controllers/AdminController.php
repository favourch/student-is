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
use Models\ClientModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class AdminController extends BaseController {

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = false;

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
	 * This method adds a new client to the database
	 * @param string $token The token to authenticate request
	 * @return JSON
	 */
	public function addClient($token){

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
	 * This method adds a new user to the database
	 * @param string $token The token to authenticate request
	 * @return JSON
	 */
	public function addUser($token){
		
		$user = json_decode($_POST['model']);
		
		$client = array(
			'first_name' => $user->first_name,
			'last_name' => $user->last_name,
			'password' => md5($user->password),
			'email' => $user->email,			
			'user_type' => $user->user_type
		);

		$create = UserModel::save($client);
		$new = UserModel::getById($create->lastInsertId());
		
		View::renderJSON($new->result_array()[0]);	
	}

}

