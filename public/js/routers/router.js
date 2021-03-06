define([
	'backbone'
	], function(Backbone){

	var AppRouter = Backbone.Router.extend({
		
		routes: {
			'' : 'home',
			'login' : 'login',
			'signup' : 'signup',
			'home' : 'home',
			'about' : 'about',
			'blog' : 'blog',
			'contact' : 'contact',
			'logout/:token' : 'logout',
			'admin/:page/:token' : 'admin',
			'dashboard/:page/:token' : 'dashboard',
			'students/:page/:token' : 'students',
			'exams/:page/:token' : 'exams',
			'settings/:page/:token' : 'settings'
		}

	});

	return AppRouter;

});