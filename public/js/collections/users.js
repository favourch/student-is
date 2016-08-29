define([
	'underscore',
	'backbone',
	'models/user'
	], function(_, Backbone, User){

	var UsersCollection = Backbone.Collection.extend({

		model: User,

		url: function () {
			return baseURL + "admin.adduser?token=" +  tokenString;
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new UsersCollection();

});