define([
	'underscore',
	'backbone',
	'models/users/class'
	], function(_, Backbone, Class){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var StudentsCollection = Backbone.Collection.extend({

		model: Class,
		
		url: function () {
			return baseURL + "settings/classes?token=" + tokenString;
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new StudentsCollection();

});