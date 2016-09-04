define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Class = Backbone.Model.extend({

		defaults: {
			client_id: '',
			name: '',
			description: ''
		}

	});

	return Class;

});