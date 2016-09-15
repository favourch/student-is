define([
	'underscore',
	'backbone',
	'models/users/report'
	], function(_, Backbone, Report){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var Reports = Backbone.Collection.extend({

		model: Report,

		url: function () {
			return baseURL + "marks/reports";
		},

		comparator: function(model){
			return -model.get('total');
		}
		
	});

	return new Reports();

});