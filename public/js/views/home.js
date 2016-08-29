define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/partials/landing-nav.html',
	'text!templates/partials/landing-footer.html',
	'text!templates/partials/ajax-error-script.html',
	'text!templates/home.html',
	'bootstrap'
	], function($, _, Backbone, Nav, Footer, AjaxErrorTpl, IndexTemplate){

	var IndexView = Backbone.View.extend({

		el: $("#wrapper"),

		title: "Home - Student Information System",

		template: _.template(Nav + IndexTemplate + Footer),

		ajaxErrorTpl: _.template(AjaxErrorTpl),

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

			//add the code to handle ajax error codes
			$("#error-handle-script").empty().html(this.ajaxErrorTpl());
			
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return IndexView;

});