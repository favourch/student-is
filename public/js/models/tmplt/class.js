define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	var Class = Backbone.Model.extend({

		defaults: {
			class_name: '',
			description: ''
		}

	});

	return Class;

});