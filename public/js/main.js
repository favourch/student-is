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
		}
	},
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		bootstrap: 'libs/bootstrap.min',
		backboneLocalstorage: 'libs/backbone.localstorage',
		text: 'libs/require.text'
	}
});

require([
	'backbone',
	'routers/router', 
	'views/login/login' 
	], function (Backbone, Router, LoginView) {
	
	// Initialize routing and start Backbone.history()
	var App = new Router();

	App.on('route:home', function(){
		new HomeView;
	});

	App.on('route:blog', function(){
		new BlogView;
	});

	App.on('route:about', function(){
		new AboutView;
	});

	App.on('route:contact', function(){
		new ContactView;
	});

	Backbone.history.start();

	// Initialize the application view
	new LoginView;
});
