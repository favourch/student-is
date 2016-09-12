define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var SpreadEntry = Backbone.Model.extend({

		defaults: {
			class_id: 0
		}

	});

	return SpreadEntry;

});