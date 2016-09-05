define([
	'underscore',
	'backbone',
	'models/users/subject'
	], function(_, Backbone, Subject){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var SubjectsCollection = Backbone.Collection.extend({

		model: Subject,

		url: function () {
			return baseURL + "settings/subjects";
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new SubjectsCollection();

});