define([
	'underscore',
	'backbone',
	'models/users/student'
	], function(_, Backbone, Student){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var StudentsCollection = Backbone.Collection.extend({

		model: Student,
		
		url: function () {
			return baseURL + "students/students?token=" + tokenString;
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new StudentsCollection();

});