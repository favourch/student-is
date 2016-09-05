define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Subject = Backbone.Model.extend({

		defaults: {
			name: '',
			class_id: 0,
			description: ''
		}

	});

	return Subject;

});