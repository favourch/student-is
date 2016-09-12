define([
	'underscore',
	'backbone',
	'models/users/spreadsheet-entry'
	], function(_, Backbone, MarkEntry){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var Spreadsheet = Backbone.Collection.extend({

		model: MarkEntry,

		url: function () {
			return baseURL + "settings/spreadsheet";
		},

		//todos sorted by their original insertion order
		comparator: 'total'
	});

	return new Spreadsheet();

});