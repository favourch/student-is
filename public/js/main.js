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
	'views/login',
	'views/home', 
	'views/signup', 
	'views/about', 
	'views/contact',
	'views/admin',
	'views/dashboard'	], function (
		Backbone, Router, LoginView, HomeView,
		SignupView, AboutView, ContactView, AdminView, DashView) {
	
	// Initialize routing and start Backbone.history()
	var App = new Router();

	App.on('route:login', function(){
		new LoginView;
	});

	App.on('route:home', function(){
		new HomeView;
	});

	App.on('route:signup', function(){
		new SignupView;
	});

	App.on('route:about', function(){
		new AboutView;
	});

	App.on('route:contact', function(){
		new ContactView;
	});

	App.on('route:admin', function(){
		new AdminView;
	});	

	App.on('route:dashboard', function(){
		new DashView;
	});

	Backbone.history.start();

	// Initialize the application view
	new HomeView;
});
