define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	var Exam = Backbone.Model.extend({

		defaults: {
			exam_name: ''
		}

	});

	return Exam;

});