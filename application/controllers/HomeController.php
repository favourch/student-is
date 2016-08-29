<?php namespace Controllers;

/**
 *This class loads the application homepage
 *@author Geoffrey Oliver <geoffreybans2@gmail.com>
 *@copyright 2015 - 2020 Geoffrey Bans
 *@category Controllers
 *@package Controllers\Home
 *@link https://github.com/geoffreybans/student-is
 *@license http://opensource.org/licenses/MIT MIT License
 *@version 1.0.1
 */

use Drivers\Templates\View;
use Libraries\CronLibrary\SampleCronController;
use Models\UsersModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class HomeController extends BaseController {

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
		View::render('home.index',$data);

	}
	
}

