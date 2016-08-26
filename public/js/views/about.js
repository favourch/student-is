define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/about.html',
	'bootstrap'
	], function($, _, Backbone, AboutTemplate){

	var AboutView = Backbone.View.extend({

		el: $("body"),

		title: "About - Business Casual - Start Bootstrap Theme",

		template: _.template(AboutTemplate),

		initialize: function(){
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return AboutView;

});