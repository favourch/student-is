define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/admissions/home.html',
	'tablesorter',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, HomeTpl){

	var Admissions = Backbone.View.extend({

		el: $(".container-fluid"),

		title: "Admissions - Student Information System",

		template: _.template(HomeTpl),

		initialize: function(){
			
			$("title").html(this.title);
			this.$el.html(this.template({
				user: userData,
				token: tokenString
			}));
			       
		}
		
	});

	return Admissions;

});