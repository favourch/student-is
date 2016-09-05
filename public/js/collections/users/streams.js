define([
	'underscore',
	'backbone',
	'models/users/stream'
	], function(_, Backbone, stream){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var StreamsCollection = Backbone.Collection.extend({

		model: stream,

		url: function () {
			return baseURL + "settings/streams";
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new StreamsCollection();

});