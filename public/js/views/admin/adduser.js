define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users',
	'text!templates/admin/adduser.html',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, Users, addUserTpl){

	var AddUser = Backbone.View.extend({

		tagName: 'div',

		template: _.template(addUserTpl),

		events: {
			'submit #add-user' : 'addUserPost',
		},

		initialize: function(){

			//some code here...			       
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
					$(".success-message").html("Client added successfully!").show(400);
					$(".submit-button").html("Submit");
				},
				error: function(){
					$(".error-message").html("Please check the errors below!").show(400);
					$(".submit-button").html("Submit");
				}
			});
			
			this.clearNewUser()
		},

		clearNewUser: function(){
			$("#first-name").val('');
			$("#last-name").val('');
			$("#email").val('');
			$("#password").val('');
		}

	});

	return AddUser;

});