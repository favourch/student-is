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
use Models\ExamModel;
use Models\SubjectModel;
use Models\StreamModel;
use Models\TeacherModel;
use Models\GradeModel;
use Models\TermModel;
use Helpers\Url\Url;
use Helpers\Input\Input;

class SettingsController extends BaseController {

	/**
	 * @var bool Set to true to enable method filters in this controller
	 */
	public $enable_method_filters = true;

	/**
	 * @var int The client_id for this request
	 */
	protected $client_id = null; 

	/**
	 * @var array The information about this client(user)
	 */
	protected $client = array();

	/**
	 * This method returns a list of all users for this client in the database
	 * @before authClientUser
	 * @param null
	 * @return JSON object of users
	 */
	public function getUsers(){

		$users = UserModel::where('client_id = ?', $this->client_id)
					->all();
		View::renderJSON($users->result_array());
		
	}
	/**
	 * This method adds a new user for a client to the database
	 * @before authClientAdmin
	 * @param int $user_id The id of the user to update/delete
	 * @return JSON
	 */
	public function postUsers($user_id){

		if (!$user_id) {
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
			$message .= "Email: {$user->email} \r\n Password: $password\r\n  You can login using this link Url::base()";
			$headers = "From: geoffreybans@gmail.com \r\n Reply-To: {$this->client['email']} \r\n X-Mailer: PHP/ phpversion()";
			// In case any of our lines are larger than 70 characters, we should use wordwrap()
			$message = wordwrap($message, 70, "\r\n");
			// Send email
			mail($user->email, 'Student IS - Account Created', $message, $headers);
			
			$new = UserModel::getById($create->lastInsertId());
			View::renderJSON($new->result_array()[0]);			
		} 
		else {
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$userData = json_decode($_POST['model']);
				$updateUser = array(
					'first_name' => $userData->first_name,
					'last_name' => $userData->last_name,
					'email' => $userData->email
				);

				UserModel::where('id = ?', $user_id)
							->save($updateUser);

			}
			//this is a DELETE request
			else{
				//delete this user from  the DB
				UserModel::where('id = ?', $user_id)
						->delete();

			}		

		}
		
	}

	/**
	 * This method returns information about a specific class
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getClass(){
		$class = ClassModel::where('client_id = ?', $this->client_id)
							->where('id = ?', Input::get('class_id'))
							->all();
		//get the class population
		$population = StudentModel::where('client_id = ?', $this->client_id)
							->where('class_id = ?', Input::get('class_id'))
							->count()
							->num_rows();
		$class = $class->result_array()[0];
		$class['population'] = $population;

		View::renderJSON($class);

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
		//populate class properties
		if ($classes->num_rows() > 0) {
			
			$return = array();
			foreach ($classes->result_array() as $class) {
				$class['streams'] = StreamModel::where('client_id = ?', $this->client_id)
												->where('class_id = ?', $class['id'])
												->count()
												->num_rows();
				$class['subjects'] = SubjectModel::where('client_id = ?', $this->client_id)
												->where('class_id = ?', $class['id'])
												->count()
												->num_rows();
				$class['exams'] = ExamModel::where('client_id = ?', $this->client_id)
												->where('class_id = ?', $class['id'])
												->count()
												->num_rows();
				$class['population'] = StudentModel::where('client_id = ?', $this->client_id)
												->where('class_id = ?', $class['id'])
												->count()
												->num_rows();
				$return[] = $class;
			}

			View::renderJSON($return);
		}
		else{
			//return empty array if there are no classes yet
			View::renderJSON(array());
		}
		
	}	

	/**
	 * This methods creates/updates/deletes all classes in the database for this client
	 * @before authClientUser
	 * @param int $class_id The id of the class to update/delete
	 * @return Object JSON
	 */
	public function postClasses($class_id){
		
		//check for a CREATE request
		if(!$class_id){

			$class = json_decode($_POST['model']);		
			$newClass = array(
				'class_name' => $class->class_name,
				'class_teacher' => $class->class_teacher,
				'description' => $class->description,
				'client_id' => $this->client_id
			);

			$create = ClassModel::save($newClass);
			$new = ClassModel::getById($create->lastInsertId());
			$class = $new->result_array()[0];

			//populate class metadata like the streams, subjects e.t.c
			$class['streams'] = 0;
			$class['subjects'] = 0;
			$class['exams'] = 0;
			$class['population'] = 0;

			View::renderJSON($class);
		}
		else{
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$classData = json_decode($_POST['model']);
				$updateClass = array(
					'class_name' => $classData->class_name,
					'class_teacher' => $classData->class_teacher
				);

				ClassModel::where('id = ?', $class_id)
							->save($updateClass);

			}
			//this is a DELETE request
			else{
				//delete the class
				ClassModel::where('id = ?', $class_id)
						->delete();
				//delete related streams
				StreamModel::where('class_id = ?', $class_id)
						->delete();
				//delete related subjects
				SubjectModel::where('class_id = ?', $class_id)
						->delete();
				//delete the exams related to this class
				ExamModel::where('class_id = ?', $class_id)
						->delete();
				//delete all students who belong to this class
				StudentModel::where('class_id = ?', $class_id)
						->delete();			

			}	

		}	

	}
	
	/**
	 * This method returns a list of all class streams for a client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getStreams(){
		
		if(Input::get('class_id')){
			$streams = StreamModel::where('client_id = ?', $this->client_id)
							->where('class_id = ?', Input::get('class_id'))
							->all();		
		}
		else{
			$streams = StreamModel::where('client_id = ?', $this->client_id)
								->all();
		}
		
		View::renderJSON($streams->result_array());
	}	
 
	/**
	 * This method creates/updates/deletes class streams for a client
	 * @before authClientUser 
	 * @param int $stream_id The id of the stream to update/delete
	 * @return Object JSON
	 */
	public function postStreams($stream_id){
		
		//check for a CREATE request
		if(!$stream_id){
			
			$streamData = json_decode($_POST['model']);		
			$newStream = array(
				'stream_name' => $streamData->stream_name,
				'stream_abbr' => $streamData->stream_abbr,
				'stream_teacher' => $streamData->stream_teacher,
				'description' => $streamData->description,
				'class_id' => $streamData->class_id,
				'client_id' => $this->client_id
			);

			$create = StreamModel::save($newStream);
			$newStream = StreamModel::getById($create->lastInsertId());
			$stream = $newStream->result_array()[0];

			//get the class population
			$population = StudentModel::where('client_id = ?', $this->client_id)
								->where('class_id = ?', $streamData->class_id)
								->where('stream_id = ?', $create->lastInsertId())
								->count()
								->num_rows();
			$stream['population'] = $population;

			View::renderJSON($stream);	
		}
		else{
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$streamData = json_decode($_POST['model']);
				$updateStream = array(
					'stream_name' => $streamData->stream_name,
					'stream_teacher' => $streamData->stream_teacher,
					'stream_abbr' => $streamData->stream_abbr
				);

				StreamModel::where('id = ?', $stream_id)
							->save($updateStream);

			}
			//this is a DELETE request
			else{
				StreamModel::where('id = ?', $stream_id)
						->delete();
			}	

		}

	}

	/**
	 * This method returns a list of all class subjects for a client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getSubjects(){

		if(Input::get('class_id')){

			$subjects = SubjectModel::where('client_id = ?', $this->client_id)
								->where('class_id = ?', Input::get('class_id'))
								->all();
		}
		else{
			$subjects = SubjectModel::where('client_id = ?', $this->client_id)
								->all();
		}

		View::renderJSON($subjects->result_array());
	}		

	/**
	 * This method creates/deletes/updates class subjects for a client
	 * @before authClientUser
	 * @param int $subject_id The unique id of the subject to delete/update
	 * @return Object JSON
	 */
	public function postSubjects($subject_id){
		
		//check for a CREATE request
		if(!$subject_id){
			
			$subjectData = json_decode($_POST['model']);		
			$newSubject = array(
				'subject_name' => $subjectData->subject_name,
				'subject_abbr' => $subjectData->subject_abbr,
				'subject_teacher' => $subjectData->subject_teacher,
				'description' => $subjectData->description,
				'class_id' => $subjectData->class_id,
				'client_id' => $this->client_id
			);

			$create = SubjectModel::save($newSubject);
			$newSubject = SubjectModel::getById($create->lastInsertId());
			$subject = $newSubject->result_array()[0];

			View::renderJSON($subject);			
		}
		else{
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$subjectData = json_decode($_POST['model']);
				$updateSubject = array(
					'subject_name' => $subjectData->subject_name,
					'subject_abbr' => $subjectData->subject_abbr,
					'subject_teacher' => $subjectData->subject_teacher,
					'description' => $subjectData->description
				);

				SubjectModel::where('id = ?', $subject_id)
							->save($updateSubject);

			}
			//this is a DELETE request
			else{
				SubjectModel::where('id = ?', $subject_id)
						->delete();
			}

		}
	
	}	

	/**
	 * This method returns a list of all class exams for a client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getExams(){

		if(Input::get('client_id')){
			$exams = ExamModel::where('client_id = ?', $this->client_id)
						->where('class_id = ?', Input::get('class_id'))
						->all();
		}
		else {
			$exams = ExamModel::where('client_id = ?', $this->client_id)
								->all();
		}
		
		View::renderJSON($exams->result_array());
	}

	/**
	 * This method creates/updates/deletes class exams for a client
	 * @before authClientUser
	 * @param int $exam_id The unique id for this exam to update/delete
	 * @return Object JSON
	 */
	public function postExams($exam_id){

		//this is a CREATE request
		if(!$exam_id){

			$examData = json_decode($_POST['model']);		
			$newExam = array(
				'exam_name' => $examData->exam_name,
				'exam_abbr' => $examData->exam_abbr,
				'exam_out_of' => $examData->exam_out_of,
				'description' => $examData->description,
				'class_id' => $examData->class_id,
				'client_id' => $this->client_id
			);

			$create = ExamModel::save($newExam);
			$newExam = ExamModel::getById($create->lastInsertId());
			$exam = $newExam->result_array()[0];

			View::renderJSON($exam);	
		}
		else{

			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$examData = json_decode($_POST['model']);
				$updateExam = array(
					'exam_name' => $examData->exam_name,
					'exam_abbr' => $examData->exam_abbr,
					'description' => $examData->description,
					'exam_out_of' => $examData->exam_out_of
				);

				ExamModel::where('id = ?', $exam_id)
							->save($updateExam);

			}
			//this is a DELETE request
			else{
				ExamModel::where('id = ?', $exam_id)
							->delete();
			}

		}		

	}	

	/**
	 * This methods gets all teachers in the database for this client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getTeachers(){
		$teachers = TeacherModel::where('client_id = ?', $this->client_id)
							->all();

		View::renderJSON($teachers->result_array());	
		
	}	

	/**
	 * This methods creates/updates/deletes all teachers in the database for this client
	 * @before authClientUser
	 * @param int $teacher_id The id of the teacher to update/delete
	 * @return Object JSON
	 */
	public function postTeachers($teacher_id){
		
		//check for a CREATE request
		if(!$teacher_id){

			$teacher = json_decode($_POST['model']);		
			$newTeacher = array(
				'teacher_title' => $teacher->teacher_title,
				'first_name' => $teacher->first_name,
				'last_name' => $teacher->last_name,
				'client_id' => $this->client_id
			);

			$create = TeacherModel::save($newTeacher);
			$new = TeacherModel::getById($create->lastInsertId());
			$teacher = $new->result_array()[0];

			View::renderJSON($teacher);
		}
		else{
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$teacherData = json_decode($_POST['model']);
				$updateTeacher = array(
					'teacher_title' => $teacherData->teacher_title,
					'first_name' => $teacherData->first_name,
					'last_name' => $teacherData->last_name
				);

				TeacherModel::where('id = ?', $teacher_id)
							->save($updateTeacher);

			}
			//this is a DELETE request
			else{
				//delete the class
				TeacherModel::where('id = ?', $teacher_id)
						->delete();		

			}	

		}	

	}

	/**
	 * This methods gets grading for all classes in the database for this client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getGrades(){

		//get a list of all the available grading
		$grades = GradeModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($grades->result_array());	
		
	}	

	/**
	 * This methods creates/updates/deletes all grades in the database for this client
	 * @before authClientUser
	 * @param int $grade_id The id of the grade to update/delete
	 * @return Object JSON
	 */
	public function postGrades($grade_id){
		
		//check for a CREATE request
		if(!$grade_id){

			$grade = json_decode($_POST['model']);		
			$newGrade = array(
				'class_id' => $grade->class_id,
				'client_id' => $this->client_id,
				'from_score' => $grade->from_score,
				'to_score' => $grade->to_score,
				'letter_grade' => $grade->letter_grade,
				'remarks' => $grade->remarks
			);

			$create = GradeModel::save($newGrade);
			$new = GradeModel::getById($create->lastInsertId());
			$grade = $new->result_array()[0];

			View::renderJSON($grade);
		}
		else{
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$gradeData = json_decode($_POST['model']);
				$updateGrade = array(
					'class_id' => $gradeData->class_id,
					'client_id' => $this->client_id,
					'from_score' => $gradeData->from_score,
					'to_score' => $gradeData->to_score,
					'letter_grade' => $gradeData->letter_grade,
					'remarks' => $gradeData->remarks
				);

				GradeModel::where('id = ?', $grade_id)
							->save($updateGrade);

			}
			//this is a DELETE request
			else{
				//delete the class
				GradeModel::where('id = ?', $grade_id)
						->delete();		

			}	

		}	

	}

	/**
	 * This methods gets grading for all classes in the database for this client
	 * @before authClientUser
	 * @param null
	 * @return Object JSON
	 */
	public function getTerms(){

		//get a list of all the available grading
		$terms = TermModel::where('client_id = ?', $this->client_id)
								->all();
		View::renderJSON($terms->result_array());	
		
	}	

	/**
	 * This methods creates/updates/deletes all terms in the database for this client
	 * @before authClientUser
	 * @param int $term_id The id of the term to update/delete
	 * @return Object JSON
	 */
	public function postTerms($term_id){
		
		//check for a CREATE request
		if(!$term_id){

			$term = json_decode($_POST['model']);		
			$newTerm = array(
				'client_id' => $this->client_id,
				'term_name' => $term->term_name,
				'term_abbr' => $term->term_abbr,
				'start_date' => $term->start_date,
				'end_date' => $term->end_date
			);

			$create = TermModel::save($newTerm);
			$new = TermModel::getById($create->lastInsertId());
			$term = $new->result_array()[0];

			View::renderJSON($term);
		}
		else{
			//this is an UPDATE request
			if (isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
				$term = json_decode($_POST['model']);
				$updateTerm = array(
					'client_id' => $this->client_id,
					'term_name' => $term->term_name,
					'term_abbr' => $term->term_abbr,
					'start_date' => $term->start_date,
					'end_date' => $term->end_date
				);

				TermModel::where('id = ?', $term_id)
							->save($updateTerm);

			}
			//this is a DELETE request
			else{
				//delete the class
				TermModel::where('id = ?', $term_id)
						->delete();		

			}	

		}	

	}

	/**
	 * This method returns the details for this client
	 * @before authClientUser
	 * @param null
	 * @return JSON
	 */
	public function getClient(){
		$client = ClientModel::where('id = ?', $this->client_id)
						->first()
						->result_array();
		View::renderJSON($client);
	}

}

