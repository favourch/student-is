define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Class = Backbone.Model.extend({

		defaults: {
			client_id: '',
			name: '',
			streams: {},
			subjects: {},
			exams: {},
			population: 0
		}

	});

	return Class;

});