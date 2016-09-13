define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var stream = Backbone.Model.extend({

		defaults: {
			stream_name: '',
			stream_abbr: '',
			stream_teacher: 0,
			class_id: 0,
			description: '',
			population: 0,
			date_created: 'Just now'
		}

	});

	return stream;

});