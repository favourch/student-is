define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/blog.html',
	'bootstrap'
	], function($, _, Backbone, BlogTemplate){

	var BlogView = Backbone.View.extend({

		el: $("body"),
		
		title: "Blog - Business Casual - Start Bootstrap Theme",

		template: _.template(BlogTemplate),

		initialize: function(){
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return BlogView;

});