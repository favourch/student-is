define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/students',
	'views/students/student',
	'views/students/new',
	'text!templates/students/all.html'
	], function($, _, Backbone, StudentsCol, studentView, newStudent, AllStudents){

	var Students = Backbone.View.extend({

		allStudents: _.template(AllStudents),

		title: "Student Information System",
		 
		initialize: function(page, token){
			
			$("title").html(this.title);
			this.$main = $(".container-fluid");

			switch(page){

				case 'all':
					
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
						reset: true
					});

					break;
				case 'new':

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
			this.$studentsList.append(view.render().el);
		},

		addAllStudents: function(){
			this.$studentsList.empty();
			StudentsCol.each(this.addOneStudent, this);
		}
		
	});

	return Students;

});