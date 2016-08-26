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
			'admin' : 'admin',
			'dashboard' : 'dashboard'
		}

	});

	return AppRouter;

});