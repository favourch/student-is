define([
	'jquery',
	'underscore',
	'backbone',
	'views/login/login-view'	
	], function($, _, Backbone, LoginView){

	var Login = Backbone.View.extend({

		el: $("#wrapper"),

		initialize: function(){

			var view = new LoginView;
			this.$el.html(view.render().el);
		
		}
		
	});

	return Login;

});