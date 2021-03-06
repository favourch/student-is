define([
	'underscore',
	'backbone',
	'models/users/user'
	], function(_, Backbone, User){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var UsersCollection = Backbone.Collection.extend({

		model: User,

		url: function () {
			return baseURL + "settings/users";
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new UsersCollection();

});