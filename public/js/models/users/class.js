define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	var Class = Backbone.Model.extend({

		defaults: {
			id: 0,
			class_name: '',
			class_teacher: '',
			description: '',
			subjects: 0,
			streams: 0,
			exams: 0,
			population: 0
		}

	});

	return Class;

});