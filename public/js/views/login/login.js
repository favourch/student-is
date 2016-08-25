define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/login/login.html',
	'bootstrap'
	], function($, _, Backbone, LoginTemplate){

	var LoginView = Backbone.View.extend({

		el: $(".container"),
		
		title: "Blog - Business Casual - Start Bootstrap Theme",

		template: _.template(LoginTemplate),

		initialize: function(){
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return LoginView;

});