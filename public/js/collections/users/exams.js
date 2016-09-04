define([
	'underscore',
	'backbone',
	'models/users/exam'
	], function(_, Backbone, Exam){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var ExamsCollection = Backbone.Collection.extend({

		model: Exam,

		url: function () {
			return baseURL + "settings/exams?token=" +  tokenString;
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new ExamsCollection();

});