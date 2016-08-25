<?php namespace Controllers;

/**
 *This class loads the application homepage
 *@author Geoffrey Oliver <geoffrey.oliver2@gmail.com>
 *@copyright 2015 - 2020 Geoffrey Oliver
 *@category Controllers
 *@package Controllers\Home
 *@link https://github.com/gliver-mvc/gliver
 *@license http://opensource.org/licenses/MIT MIT License
 *@version 1.0.1
 */

use Drivers\Templates\View;
use Libraries\CronLibrary\SampleCronController;
use Models\UsersModel;
use Helpers\Url\Url;

class LoginController extends BaseController {

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

		View::render('login.index',$data);

	}
	
	/**
	 * This method performs user authentication
	 * @param string $email The user email
	 * @param string $password The use password
	 * @return JSON authentication results
	 * @throws null This  method does not throw an error
	 */
	public function checkuser($email, $password){
		
		$user = UsersModel::where("email = ?", $email);

		if ($user) {
			View::renderJSON(array("result" => $user));
		}

	}
}

