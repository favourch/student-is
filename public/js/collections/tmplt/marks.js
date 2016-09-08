define([
	'underscore',
	'backbone',
	'models/tmplt/mark'
	], function(_, Backbone, Mark){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var MarksCollection = Backbone.Collection.extend({

		model: Mark,
		
		url: function () {
			return baseURL + "marks/marks";
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new MarksCollection();

});