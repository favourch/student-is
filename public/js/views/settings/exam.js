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
			'click .editExam' : 'editExam',
			'click .deleteExam' : 'deleteExam'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		editExam: function(){

		},

		deleteExam: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});
		}

	});

	return Exam;

});