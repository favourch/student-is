define([
	'underscore',
	'backbone',
	'models/tmplt/exam'
	], function(_, Backbone, Exam){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var ExamsCollection = Backbone.Collection.extend({

		model: Exam,
		
		url: function () {
			return baseURL + "students/exams";
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new ExamsCollection();

});