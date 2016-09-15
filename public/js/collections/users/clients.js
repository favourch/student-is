define([
	'underscore',
	'backbone',
	'models/users/client'
	], function(_, Backbone, Client){
	
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	
	var ClientsCollection = Backbone.Collection.extend({

		model: Client,
		
		url: function () {
			return baseURL + "settings/client";
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new ClientsCollection();

});