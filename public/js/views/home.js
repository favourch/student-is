define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/home.html',
	'bootstrap'
	], function($, _, Backbone, IndexTemplate){

	var IndexView = Backbone.View.extend({

		el: $(".main-body"),

		title: "Home - Student Information System",

		template: _.template(IndexTemplate),

		initialize: function(){
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return IndexView;

});