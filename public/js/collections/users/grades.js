define([
	'underscore',
	'backbone',
	'models/users/grade'
	], function(_, Backbone, Grade){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var GradesCollection = Backbone.Collection.extend({

		model: Grade,

		url: function () {
			return baseURL + "settings/grades";
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new GradesCollection();

});