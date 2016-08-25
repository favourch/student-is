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

			var email = $("#username").val();
			var pass = $("#password").val();
			var url = baseURL + "login/checkuser";

			$.ajax({
				url: url,
				type: "post",
				data: {
					email: email,
					password: pass
				},
				success: function(data){
					console.log("Success");
				},
				error: function(err){
					console.log(err)
				}
			});
			
		}
		
	});

	return LoginView;

});