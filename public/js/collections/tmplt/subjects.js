define([
	'underscore',
	'backbone',
	'models/tmplt/subject'
	], function(_, Backbone, Subject){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var SubjectsCollection = Backbone.Collection.extend({

		model: Subject,

		url: function () {
			return baseURL + "students/subjects";
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new SubjectsCollection();

});