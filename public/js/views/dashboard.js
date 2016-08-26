define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/dashboard/header.html',
	'text!templates/dashboard/nav.html',
	'text!templates/dashboard/home.html',
	'tablesorter',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, HeaderTemplate, NavTemplate,HomeTemplate){

	var DashView = Backbone.View.extend({

		el: $("#wrapper"),

		title: "Dashboard - Student Information System",

		template: _.template(NavTemplate + HomeTemplate),

		initialize: function(){
			//this will ensure the css is only added once
			$("#customCSS").remove();
			//this will add the current css to the page 
			$('head').append(HeaderTemplate);
			       
			$("title").html(this.title);
			this.$el.html(this.template({
				user: userData
			}));
		}
		
	});

	return DashView;

});