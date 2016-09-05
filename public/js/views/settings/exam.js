define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/exam.html'
	], function($, _, Backbone, examTpl){

	var Exam = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(examTpl),

		events: {
			'click .destroy' : 'deleteExam'
		},

		initialize: function(){

			//some code here...			       
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		deleteExam: function(evt){
			evt.preventDefault();
			this.model.destroy();
		}

	});

	return Exam;

});