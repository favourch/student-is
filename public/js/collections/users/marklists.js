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

		//marks sorted by the average score column
		comparator: function(model){
			return -model.get('average');
		}

	});

	return new MarksCollection();

});