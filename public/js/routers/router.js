define([
	'backbone'
	], function(Backbone){

	var AppRouter = Backbone.Router.extend({
		
		routes: {
			'login' : 'login',
			'signup' : 'signup',
			'home' : 'home',
			'about' : 'about',
			'blog' : 'blog',
			'contact' : 'contact',
			'admin/:page/:token' : 'admin',
			'dashboard/:page/:token' : 'dashboard',
			'admissions/:page/:token' : 'admissions',
			'academics/:page/:token' : 'academics'
		}

	});

	return AppRouter;

});