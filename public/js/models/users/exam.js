define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Exam = Backbone.Model.extend({

		defaults: {
			name: '',
			class_id: 0,
			description: ''
		}

	});

	return Exam;

});