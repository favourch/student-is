define([
	'underscore',
	'backbone'
	], function(_, Backbone){
	
	var Mark = Backbone.Model.extend({

		defaults: {
			student_id: null,
			reg_number: null,
			first_name: null,
			middle_name: null,
			last_name: null,
			class_id: null,
			subject_id: null,
			exam_id: null,
			term_id: null,
			exam_year: null,
			exam_score: null,
			exam_percent: null
		}

	});

	return Mark;

});