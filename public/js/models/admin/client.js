define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Client = Backbone.Model.extend({

		defaults: {
			institution: '',
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			address: '',
			code: '',
			city: '',
			user_role: 3
		}

	});

	return Client;

});