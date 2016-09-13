define([
	'underscore',
	'backbone',
	'models/users/spreadsheet'
	], function(_, Backbone, rowEntry){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var Spreadsheet = Backbone.Collection.extend({

		model: rowEntry,

		url: function () {
			return baseURL + "marks/spreadsheet";
		}
		
	});

	return new Spreadsheet();

});