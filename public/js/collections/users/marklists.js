define([
	'underscore',
	'backbone',
	'models/users/marklist'
	], function(_, Backbone, Marklist){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var MarksCollection = Backbone.Collection.extend({

		model: Marklist,
		
		url: function () {
			return baseURL + "marks/marklist";
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new MarksCollection();

});