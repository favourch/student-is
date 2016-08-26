define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/login.html',
	'bootstrap'
	], function($, _, Backbone, LoginTemplate){

	var LoginView = Backbone.View.extend({

		el: $(".main-body"),
	
		template: _.template(LoginTemplate),

		events: {
			'submit #login-form' : 'authUser'
		},

		initialize: function(){
			this.$el.html(this.template());
		},

		authUser: function(e){

			e.preventDefault();
			$(".alert-danger").hide(500);
			$(".submit-button").text("Please wait...");

			var email = $("#username").val();
			var pass = $("#password").val();
			var url = baseURL + "login.checkuser";

			$.ajax({
				url: url,
				type: "post",
				data: {
					email: email,
					password: pass
				},
				success: function(data){

					if (data['error'] != null) {
						$(".alert-danger").text(data['error']).show(500);
						$(".submit-button").text("Login");
					}
					else {
						$(".alert-danger").text('success').show(500);
						tokenString = data['token'];
						userData = data['user'];
						window.location.replace(baseURL + '#admin');
					}
					
				},
				error: function(err){
					$(".alert-danger").text("Login Failed!").show(500);
					$(".submit-button").text("Login");
					console.log(err)
				}
			});
			
		}
		
	});

	return LoginView;

});