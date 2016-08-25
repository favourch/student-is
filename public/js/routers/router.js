define([
	'jquery',
	'backbone'
	], function($, Backbone){

	var AppRouter = Backbone.Router.extend({
		
		routes: {
			'login' : 'login'
		}

	});

	return AppRouter;

});