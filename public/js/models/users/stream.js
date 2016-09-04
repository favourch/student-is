define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var stream = Backbone.Model.extend({

		defaults: {
			client_id: 0,
			class_id: 0,
			name: '',
			description: ''
		}

	});

	return stream;

});