define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Exam = Backbone.Model.extend({

		defaults: {
			exam_name: '',
			exam_abbr: '',
			class_id: 0,
			description: ''
		}

	});

	return Exam;

});