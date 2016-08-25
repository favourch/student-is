define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/login/login.html',
	'bootstrap'
	], function($, _, Backbone, LoginTemplate){

	var LoginView = Backbone.View.extend({

		el: $(".container"),
	
		template: _.template(LoginTemplate),

		events: {
			'submit #login-form' : 'authUser'
		},

		initialize: function(){
			this.$el.html(this.template());
		},

		authUser: function(e){

			e.preventDefault();
			$(".alert-danger").hide();
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
					if (data['error']) {
						$(".alert-danger").text(data['error']).show();
					}
					else {
						$(".alert-danger").text("Login Success!").show();
					}
					$(".submit-button").text("Login");
				},
				error: function(err){
					$(".alert-danger").text("Login Failed!").show();
					$(".submit-button").text("Login");
					console.log(err)
				}
			});
			
		}
		
	});

	return LoginView;

});