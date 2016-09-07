define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var stream = Backbone.Model.extend({

		defaults: {
			stream_name: '',
			stream_abbr: '',
			description: ''
		}

	});

	return stream;

});