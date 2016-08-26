define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/blog.html',
	'bootstrap'
	], function($, _, Backbone, BlogTemplate){

	var BlogView = Backbone.View.extend({

		el: $(".main-body"),
		
		title: "Signup - Student Information System",

		template: _.template(BlogTemplate),

		initialize: function(){
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return BlogView;

});