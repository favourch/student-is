define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/partials/landing-nav.html',
	'text!templates/partials/landing-footer.html',
	'text!templates/about.html',
	'bootstrap'
	], function($, _, Backbone, Nav, Footer, AboutTemplate){

	var AboutView = Backbone.View.extend({

		el: $("#wrapper"),

		title: "About - Student Information System",

		template: _.template(Nav + AboutTemplate + Footer),

		initialize: function(){
			//this will ensure the css is only added once
			if ($("#customCSS").length == 0) {
				//this will add the current css to the page 
				$('head').append('<link rel="stylesheet" id="customCSS" href="css/business-casual.css">');
			} 

			//remove dash css
			if ($(".dash-header-css").length > 0) {
				$(".dash-header-css").remove();	
			}
			        
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return AboutView;

});