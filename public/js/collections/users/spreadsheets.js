define([
	'underscore',
	'backbone',
	'models/users/spreadsheet'
	], function(_, Backbone, Spreadsheet){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var Spreadsheets = Backbone.Collection.extend({

		model: Spreadsheet,

		url: function () {
			return baseURL + "marks/spreadsheet";
		},

		comparator: function(model){
			return -model.get('total');
		}
		
	});

	return new Spreadsheets();

});