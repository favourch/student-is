define([
	'underscore',
	'backbone',
	'models/users/term'
	], function(_, Backbone, Term){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

	var TermsCollection = Backbone.Collection.extend({

		model: Term,

		url: function () {
			return baseURL + "settings/terms";
		},

		//todos sorted by their original insertion order
		comparator: 'order'
	});

	return new TermsCollection();

});