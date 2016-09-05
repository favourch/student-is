define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var stream = Backbone.Model.extend({

		defaults: {
			name: '',
			class_id: 0,
			description: ''
		}

	});

	return stream;

});