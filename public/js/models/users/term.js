define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Term = Backbone.Model.extend({

		defaults: {
			term_name: '',
			exam_abbr: '',
			start_date: '',
			end_date: ''
		}

	});

	return Term;

});