define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users',
	'text!templates/admin/user-new.html',
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
					$(".success-message").html("User added successfully!").show(400);
					$(".submit-button").html("Submit");
					this.clearNewUser();
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status == 401) {
				      	$("#popup-401").modal("show");
				      	$(".popup-error-modal").click(function(){
				            $("#popup-403").modal("hide");
				            $("#popup-401").modal("hide");
        				}); 
				    } 
				    else if(textStatus.status == 403) {
				      	$("#popup-403").modal("show");
				      	$(".popup-error-modal").click(function(){
				            $("#popup-403").modal("hide");
				            $("#popup-401").modal("hide");
        				}); 
				    }
				    else {
				    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html("Submit");

				    }

				}
				
			});

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