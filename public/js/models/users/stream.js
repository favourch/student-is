define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var stream = Backbone.Model.extend({

		defaults: {
			stream_name: '',
			stream_abbr: '',
			class_id: 0,
			description: '',
			population: 0,
			date_created: 'Just now'
		}

	});

	return stream;

});