define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/users',
	'views/settings/class-new',
	'views/settings/user-new',
	'views/settings/user',
	'views/settings/profile',
	'text!templates/settings/users-all.html'
	], function($, _, Backbone, UsersCol, newClass, newUser, User, Profile, usersTpl){

	var Settings = Backbone.View.extend({

		usersTpl: _.template(usersTpl),

		title: "Student Information System",
		 
		initialize: function(page, token){
			
			this.$main = $(".container-fluid");

			switch(page){

				case 'adduser':
					
					this.$main.html(this.allTpl({
						token: tokenString
					}));

					$("title").html("New User - " + this.title);
					
					this.$studentsList = $("#students-table");
					
					this.listenTo(StudentsCol, 'add', this.addOneStudent);
					this.listenTo(StudentsCol, 'reset', this.addAllStudents);

					StudentsCol.fetch({
						reset: true
					});

					break;
				case 'addclass':
					var view = new newStudent;
					this.$main.html(view.render().el);

					break;
				case 'users':

					break;
				case 'profile':

					break;
				case 'classes':

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

	return Settings;

});