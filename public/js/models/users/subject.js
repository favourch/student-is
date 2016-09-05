define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Subject = Backbone.Model.extend({

		defaults: {
			subject_name: '',
			subject_abbr: '',
			class_id: 0,
			description: ''
		}

	});

	return Subject;

});