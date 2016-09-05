define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var Class = Backbone.Model.extend({

		defaults: {
			name: '',
			description: '',
			subjects: 0,
			streams: 0,
			exams: 0,
			population: 0
		}

	});

	return Class;

});