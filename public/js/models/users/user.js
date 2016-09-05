define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var User = Backbone.Model.extend({

		defaults: {
			first_name: '',
			last_name: '',
			email: '',
			address: '',
			code: '',
			city: '',
			user_role: 4
		}

	});

	return User;

});