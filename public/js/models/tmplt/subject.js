define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	var Subject = Backbone.Model.extend({

		defaults: {
			subject_name: ''
		}

	});

	return Subject;

});