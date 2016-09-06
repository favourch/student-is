define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/students',
	'views/students/student',
	'views/students/studentnew',
	'text!templates/students/students.html'
	], function($, _, Backbone, StudentsCol, studentView, newStudent, AllStudents){

	var Students = Backbone.View.extend({

		allStudents: _.template(AllStudents),

		title: "Student Information System",
		 
		initialize: function(page, token){
			
			$("title").html(this.title);
			this.$main = $(".container-fluid");

			switch(page){

				case 'students':
					
					this.$main.html(this.allStudents({
						token: tokenString
					}));
					$("title").html("Students - " + this.title);
					
					this.$studentsList = $("#students-table");
					
					//set event listeners for new students
					this.listenTo(StudentsCol, 'add', this.addOneStudent);
					this.listenTo(StudentsCol, 'reset', this.addAllStudents);

					//fetch list of all students from the database
					StudentsCol.fetch({
						reset: true,
						data: $.param({ 
							token: tokenString
						})
					});

					break;
				case 'studentnew':

					//load the add new student form
					var view = new newStudent;
					this.$main.html(view.render().el);

					break;

			}
	       
		},

		addOneStudent: function(student){
			var view = new studentView({
				model: student 
			});
			$('.no-students-yet').hide();
			this.$studentsList.append(view.render().el);
		},

		addAllStudents: function(){
			this.$studentsList.empty();

			if(StudentsCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-students-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-students-yet').hide();
				StudentsCol.each(this.addOneStudent, this);
			}
			
		}
		
	});

	return Students;

});