define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/students/all.html'
	], function($, _, Backbone, HomeTpl){

	var Admissions = Backbone.View.extend({

		tagName: 'div',

		title: "Admissions - Student Information System",

		template: _.template(HomeTpl),

		initialize: function(){
			
			$("title").html(this.title);
			       
		},

		render: function(){
			this.$el.html(this.template());			
			return this;
		}
		
	});

	return Admissions;

});