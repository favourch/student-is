define([
	'underscore',
	'backbone',
	'models/client'
	], function(_, Backbone, Client){
	
	Backbone.emulateJSON = true;
	
	var ClientsCollection = Backbone.Collection.extend({

		model: Client,
		
		url: function () {
			return baseURL + "admin.addclient?token=" + tokenString;
		},

		//todos sorted by their original insertion order
		comparator: 'order'

	});

	return new ClientsCollection();

});