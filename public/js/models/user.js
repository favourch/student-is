define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var User = Backbone.Model.extend({

		defaults: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			address: '',
			code: '',
			city: '',
			user_type: 3
		}

	});

	return User;

});