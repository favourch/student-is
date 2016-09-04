<?php namespace Models;

/**
 * This model creates subjects in the database for a client
 * @author Geoffrey Bans <geoffreybans@gmail.com>
 * @copyright 2015 - 2020 Geoffrey Bans
 * @category Models
 * @package Models\SubjectModel
 * @link https://github.com/geoffreybans/student-is
 * @license http://opensource.org/licenses/MIT MIT License
 * @version 1.0.1
 */

class SubjectModel extends Model {

	/**
	 * @var string The name of the table associated with this model
	 */
	protected static $table = 'subjects';

	/**
	 * @var bool Set whether query timestamps should be updated
	 */	
	protected static $update_timestamps = true;

}