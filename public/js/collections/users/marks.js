define([
	'underscore',
	'backbone',
	'models/users/mark'
	], function(_, Backbone, Mark){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
		
	var MarksCollection = Backbone.Collection.extend({

		model: Mark,
		
		url: function () {
			return baseURL + "marks/marks";
		},

		//marks sorted by the reg_number score column
		comparator: 'reg_number'

	});

	return new MarksCollection();

});