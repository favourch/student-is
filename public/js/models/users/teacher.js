define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Teacher = Backbone.Model.extend({

		defaults: {
			teacher_title: '',
			first_name: '',
			last_name: '',
			client_id: 0,
			date_created: null
		}

	});

	return Teacher;

});