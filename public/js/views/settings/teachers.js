define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/teachers',
	'views/settings/teacher',
	'text!templates/settings/teachers.html',
	'bootstrap'
	], function($, _, Backbone, TeachersCol, TeacherView, teachersTpl){

	var Teachers = Backbone.View.extend({

		tagName: 'div',

		template: _.template(teachersTpl),

		events: {
			'submit #add-new-teacher' : 'addTeacherPost'
		},

		initialize: function(){

			//load the view into the DOM
			$(".container-fluid").html(this.$el.html(this.template()));

			//define the table reference to use for adding individual teachers
			this.$teachersList = $("#teachers-list");
			
			this.listenTo(TeachersCol, 'add', this.addOneTeacher);
			this.listenTo(TeachersCol, 'reset', this.addAllTeachers);

			TeachersCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	

		},

		addTeacherPost: function(evt){
			
			evt.preventDefault(); 
			var newTeacher = {
				teacher_title: $("#teacher-title").val(),
				first_name: $("#first-name").val(),
				last_name: $("#last-name").val()
			};

			$(".submit-button").html("Please wait...");
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			TeachersCol.create(newTeacher, {
				url: baseURL + 'settings/teachers?token=' + tokenString,
				success: function(){
					$(".success-message").html("Teacher added successfully!").show(400);
					$(".submit-button").html("Submit");

					//empty the form
					$("#teacher-title").val(),
					$("#first-name").val('');
					$("#last-name").val('');				

					//fade out the modal
					$("#add_new_teacher").modal("hide");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html("Submit");

				    }

				}
				
			});

		},

		addOneTeacher: function(teacher){
			//remove the message for no teachers yet, since there is a teacher to add
			$('.no-teachers-yet').hide();
			var view = new TeacherView({
				model: teacher 
			});
			this.$teachersList.append(view.render().el);
		},

		addAllTeachers: function(){
			this.$teachersList.empty();

			if(TeachersCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-teachers-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-teachers-yet').hide();
				TeachersCol.each(this.addOneTeacher, this);
			}
			
		}

	});

	return Teachers;

});