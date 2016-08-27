define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/academics/home.html',
	'tablesorter',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, HomeTpl){

	var Academics = Backbone.View.extend({

		el: $(".container-fluid"),

		title: "Academics - Student Information System",

		template: _.template(HomeTpl),

		initialize: function(){
			
			$("title").html(this.title);
			this.$el.html(this.template({
				user: userData,
				token: tokenString
			}));
			       
		}
		
	});

	return Academics;

});