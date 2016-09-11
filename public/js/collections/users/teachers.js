define([
	'underscore',
	'backbone',
	'models/users/teacher'
	], function(_, Backbone, Teacher){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var TeachersCollection = Backbone.Collection.extend({

		model: Teacher,
		
		url: function () {
			return baseURL + "settings/teachers";
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new TeachersCollection();

});