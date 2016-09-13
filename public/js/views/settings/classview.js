define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/exams',
	'collections/users/subjects',
	'collections/users/streams',
	'collections/users/teachers',
	'collections/users/classes',
	'views/settings/stream',
	'views/settings/subject',
	'views/settings/exam',
	'text!templates/settings/classview.html',
	'text!templates/settings/classview-head.html',
	'bootstrap'
	], function($, _, Backbone, ExamsCol, SubjectsCol, StreamsCol,  Teachers, Classes, StreamView, SubjectView, ExamView, classTpl, classviewHead){

	var ClassView = Backbone.View.extend({

		tagName: 'div',

		template: _.template(classTpl),

		classviewHead: _.template(classviewHead),

		events: {
			'submit #add-new-stream' : 'addStreamPost',
			'submit #add-new-subject' : 'addSubjectPost',
			'submit #add-new-exam' : 'addExamPost'
		},

		initialize: function(classID){
			//set the class id for this class view
			this.classID = classID;

			//save reference to thi object
			var self = this;
			//get the metadata for this class
			$.ajax({
				url: baseURL + "settings/class",
				data: { 
					token: tokenString,
					class_id: classID
				},
				type: 'get',
				success: function(data){
					self.renderHead(data);
				},
				error: function(error){
					console.log(error);
				}
			});

			this.listenTo(ExamsCol, 'add', this.addOneExam);
			this.listenTo(ExamsCol, 'reset', this.addAllExams);

			this.listenTo(SubjectsCol, 'add', this.addOneSubject);
			this.listenTo(SubjectsCol, 'reset', this.addAllSubjects);

			this.listenTo(StreamsCol, 'add', this.addOneStream);
			this.listenTo(StreamsCol, 'reset', this.addAllStreams);

			this.listenTo(Teachers, 'reset', this.render);

			ExamsCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString,
					class_id: classID
				})
			});	

			SubjectsCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString,
					class_id: classID
				})
			});

			StreamsCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString,
					class_id: classID
				})
			});	

			Teachers.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	

		},

		render: function(){

			var teachers = this.getTeachers();

			$(".container-fluid").html(this.$el.html(this.template({
				class_id: classID,
				teachers: teachers
			})));	

			//define the table reference to use for adding individual classes
			this.$examsList = this.$("#exams-list");
			this.$subjectsList = this.$("#subjects-list");
			this.$streamsList = this.$("#streams-list");
			
		},

		renderHead: function(data){
			//find the class teacher id
			var classTeacher = Classes.where({id: this.classID });
			classTeacher = classTeacher.get('class_teacher');

			//get the class teacher info
			classTeacher = Teachers.where({id: classTeacher})[0].toJSON();
			data.classTeacher = classTeacher;

			$("#class-view-head").html(self.classviewHead(data));
		},

		getTeachers: function(){
			var teachers = [];
			Teachers.each(function(teacher){
				teachers.push(teacher.toJSON());
			}, this);	

			return teachers;	
		},

		addStreamPost: function(evt){

			evt.preventDefault(); 
			var newStream = {
				class_id: $("#class_id").val(),
				stream_name: $("#new-stream-name").val(),
				stream_abbr: $("#new-stream-abbr").val(),
				stream_teacher: $("#new-stream-teacher").val(),
				description: $("#new-stream-description").val()
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			StreamsCol.create(newStream, {
				url: baseURL + 'settings/streams?token=' + tokenString,
				success: function(){
					$(".success-message").html("Stream added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

					//empty the form
					$("#new-stream-name").val('');
					$("#new-stream-abbr").val('');
					$("#new-stream-teacher").val('');
					$("#new-stream-description").val('');

					//fade out the modal
					$("#add_new_stream").modal("hide");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

				    }

				}
				
			});

		},

		addOneStream: function(stream){
			//remove the message for no classes yet, since there is a class to add
			$('.no-streams-yet').hide();
			var view = new StreamView({
				model: stream 
			});
			this.$streamsList.append(view.render().el);
		},

		addAllStreams: function(){
			this.$streamsList.empty();

			if(StreamsCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-streams-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-steams-yet').hide();
				StreamsCol.each(this.addOneStream, this);
			}
			
		},		

		addSubjectPost: function(evt){

			evt.preventDefault(); 
			var newSubject = {
				class_id: $("#class_id").val(),
				subject_name: $("#new-subject-name").val(),
				subject_abbr: $("#new-subject-abbr").val(),
				subject_teacher: $("#new-subject-teacher").val(),
				description: $("#new-subject-description").val()
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			SubjectsCol.create(newSubject, {
				url: baseURL + 'settings/subjects?token=' + tokenString,
				success: function(){
					$(".success-message").html("Subject added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');
					
					//empty the form
					$("#new-subject-name").val('');
					$("#new-subject-abbr").val('');
					$("#new-subject-description").val('');
					$("#new-subject-teacher").val('');

					//fade out the modal
					$("#add_new_subject").modal("hide");

				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

				    }

				}
				
			});

		},

		addOneSubject: function(subject){
			//remove the message for no classes yet, since there is a class to add
			$('.no-subjects-yet').hide();
			var view = new SubjectView({
				model: subject 
			});
			this.$subjectsList.append(view.render().el);
		},

		addAllSubjects: function(){
			this.$subjectsList.empty();

			if(SubjectsCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-subjects-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-subjects-yet').hide();
				SubjectsCol.each(this.addOneSubject, this);
			}
			
		},		

		addExamPost: function(evt){

			evt.preventDefault(); 
			var newExam = {
				class_id: $("#class_id").val(),
				exam_name: $("#new-exam-name").val(),
				exam_abbr: $("#new-exam-abbr").val(),
				exam_out_of: $("#new-exam-out-of").val(),
				description: $("#new-exam-description").val()
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			ExamsCol.create(newExam, {
				url: baseURL + 'settings/exams?token=' + tokenString,
				success: function(){
					$(".success-message").html("Exam added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');
					
					//empty the form
					$("#new-exam-name").val('');
					$("#new-exam-abbr").val('');
					$("#new-exam-out-of").val('');
					$("#new-exam-description").val('');

					//fade out the modal
					$("#add_new_exam").modal("hide");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

				    }

				}
				
			});

		},

		addOneExam: function(exam){
			//remove the message for no classes yet, since there is a class to add
			$('.no-exams-yet').hide();
			var view = new ExamView({
				model: exam 
			});
			this.$examsList.append(view.render().el);
		},

		addAllExams: function(){
			this.$examsList.empty();

			if(ExamsCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-exams-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-exams-yet').hide();
				ExamsCol.each(this.addOneExam, this);
			}
			
		}

	});

	return ClassView;

});