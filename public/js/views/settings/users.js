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
			'submit #add-new-user' : 'addUserPost'
		},

		initialize: function(){

			//load the view into the DOM
			$(".container-fluid").html(this.$el.html(this.template()));

			//define the table reference to use for adding individual classes
			this.$usersList = $("#users-list");
			
			this.listenTo(UsersCol, 'add', this.addOneUser);
			this.listenTo(UsersCol, 'reset', this.addAllUsers);

			UsersCol.fetch({
				reset: true
			});	

		},

		addUserPost: function(e){
			
			e.preventDefault(); 
			var newUser = {
				first_name: $("#first-name").val(),
				last_name: $("#last-name").val(),
				email: $("#email").val()
			};

			$(".submit-button").html("Please wait...");
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			UsersCol.create(newUser, {
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

		},

		addOneUser: function(User){
			//remove the message for no users yet, since there is a user to add
			$('.no-users-yet').hide();
			var view = new UserView({
				model: User 
			});
			this.$usersList.append(view.render().el);
		},

		addAllUsers: function(){
			this.$usersList.empty();

			if(UsersCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-users-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-users-yet').hide();
				UsersCol.each(this.addOneUser, this);
			}
			
		}

	});

	return Users;

});