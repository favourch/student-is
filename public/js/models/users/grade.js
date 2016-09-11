define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Grade = Backbone.Model.extend({

		defaults: {
			class_id: 0,
			from_score: 0,
			to_score: 0,
			letter_grade: '',
			remarks: ''
		}

	});

	return Grade;

});