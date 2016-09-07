define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	var Mark = Backbone.Model.extend({

		defaults: {
			id: 0,
			score: ''
		}

	});

	return Mark;

});