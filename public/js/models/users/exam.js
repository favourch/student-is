define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var Exam = Backbone.Model.extend({

		defaults: {
			exam_name: '',
			exam_abbr: '',
			class_id: 0,
			description: '',
			date_created: ''
		}

	});

	return Exam;

});