define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/partials/landing-nav.html',
	'text!templates/partials/landing-footer.html',
	'text!templates/login.html',
	'bootstrap'
	], function($, _, Backbone, Nav, Footer, LoginTemplate){

	var LoginView = Backbone.View.extend({

		el: $("#wrapper"),

		title: "Login - Student Information System",

		template: _.template(Nav + LoginTemplate + Footer),

		events: {
			'submit #login-form' : 'authUser'
		},

		initialize: function(){
			//this will ensure the css is only added once
			if ($("#customCSS").length == 0) {
				//this will add the current css to the page 
				$('head').append('<link rel="stylesheet" id="customCSS" href="css/business-casual.css">');
			}  
			//remove dash css
			if ($(".dash-header-css").length > 0) {
				$(".dash-header-css").remove();	
			}
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

						if (data['user']['user_type'] == 1) {
							window.location.replace(baseURL + '#admin');
						} else{
							window.location.replace(baseURL + '#dashboard');
						}
						
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