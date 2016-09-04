define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/users',
	'views/settings/user-new',
	'views/settings/user',
	'views/settings/profile',
	'views/settings/classes',
	'text!templates/settings/users-all.html'
	], function($, _, Backbone, UsersCol, newUser, User, Profile, classesView, usersTpl){

	var Settings = Backbone.View.extend({

		usersTpl: _.template(usersTpl),

		title: "Student Information System",
		 
		initialize: function(page, token){
			
			this.$main = $(".container-fluid");

			switch(page){

				case 'adduser':
					
					this.$main.html(this.usersTpl({
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
				case 'users':

					break;
				case 'profile':

					break;
				case 'classes':
					//update the page title
					$("title").html("Classes - " + this.title);
					//load the classes view
					var view = new classesView;
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

	return Settings;

});