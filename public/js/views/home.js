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
			//this will ensure the css is only added once
			if ($("#customCSS").length == 0) {
				//this will add the current css to the page 
				$('head').append('<link rel="stylesheet" id="customCSS" href="css/business-casual.css">');
			}         

			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return IndexView;

});