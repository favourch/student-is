define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/users',
	'views/settings/user',
	'text!templates/settings/users.html',
	'bootstrap'
	], function($, _, Backbone, UsersCol, UserView, usersTpl){

	var Users = Backbone.View.extend({

		tagName: 'div',

		template: _.template(usersTpl),

		events: {
			'submit #add-new-user' : 'addUserPost',
		},

		initialize: function(){

			//include the users display template html into the view
			this.$el.html(this.template({
				token: tokenString
			}));

			//define the table reference to use for adding individual classes
			this.$usersList = $("#users-list");
			
			this.listenTo(UsersCol, 'add', this.addOneUser);
			this.listenTo(UsersCol, 'reset', this.addAllUsers);

			UsersCol.fetch({
				reset: true
			});	
		},

		render: function(){

			this.$el.html(this.template());
			return this;

		},

		addUserPost: function(e){
			
			e.preventDefault(); 
			var newUser = {
				first_name: $("#first-name").val(),
				last_name: $("#last-name").val(),
				email: $("#email").val(),
				password: $("#password").val(),
				user_type: 3
			};

			$(".submit-button").html("Please wait...");
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			Users.create(newUser, {
				success: function(){
					$(".success-message").html("User added successfully!").show(400);
					$(".submit-button").html("Submit");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html("Submit");

				    }

				}
				
			});

		}

	});

	return Users;

});