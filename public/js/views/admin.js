define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/partials/dash-header.html',
	'text!templates/admin/nav.html',
	'text!templates/admin/home.html',
	'tablesorter',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, HeaderTemplate, NavTemplate,HomeTemplate){

	var AdminView = Backbone.View.extend({

		el: $("#wrapper"),

		title: "Admin Panel - Student Information System",

		template: _.template(NavTemplate + HomeTemplate),

		initialize: function(){
			
			$("title").html(this.title);
			this.$el.html(this.template({
				user: userData,
				token: tokenString
			}));
			//this will ensure the css is only added once
			$("#customCSS").remove();
			//this will add the current css to the page 
			$('head').append(HeaderTemplate);
			       
		}
		
	});

	return AdminView;

});