/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		},
		bootstrap:{
			deps: ['jquery']
		},
		tablesorter:{
			deps: ['jquery']
		},
		jqueryui:{
			deps: ['jquery']
		}
	},
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		bootstrap: 'libs/bootstrap.min',
		backboneLocalstorage: 'libs/backbone.localstorage',
		text: 'libs/require.text',
		tablesorter: 'libs/jquery.tablesorter.min',
		jqueryui: 'libs/jquery-ui.min'
	}
});

require([
	'backbone',
	'routers/router', 
	'views/login/login',
	'views/home', 
	'views/signup', 
	'views/about', 
	'views/contact',
	'views/logout',
	'views/admin/admin',
	'views/dashboard',
	'views/students/students',
	'views/settings/settings'], function (
		Backbone, Router, Login, Home, Signup, About, Contact, 
		Logout, Admin, Dashboard, Students, Settings) {
	
	// Initialize routing and start Backbone.history()
	var App = new Router();

	App.on('route:login', function(){
		new Login;
	});

	App.on('route:home', function(){
		new Home;
	});

	App.on('route:signup', function(){
		new Signup;
	});

	App.on('route:about', function(){
		new About;
	});

	App.on('route:contact', function(){
		new Contact;
	});	

	App.on('route:logout', function(token){
		new Logout(token);
	});

	App.on('route:admin', function(page, token){
		new Admin(page, token);
	});	

	App.on('route:dashboard', function(page, token){
		new Dashboard(page, token);
	});	

	App.on('route:students', function(page, token){
		new Students(page, token);
	});	

	App.on('route:exams', function(page, token){
		new Exams(page, token);
	});

	App.on('route:settings', function(page, token){
		new Settings(page, token);
	});

	Backbone.history.start();

	// Initialize the application view
	new Home;
});
