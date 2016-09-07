define([
	'underscore',
	'backbone',
	'models/tmplt/class'
	], function(_, Backbone, Class){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var ClassesCollection = Backbone.Collection.extend({

		model: Class,
		
		url: function () {
			return baseURL + "students/classes";
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new ClassesCollection();

});