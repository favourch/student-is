define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/exams/report.html'
	], function($, _, Backbone, reportTpl){

	var Report = Backbone.View.extend({

		template: _.template(reportTpl),

		tagName: 'div',

		className: 'row col-sm-10',

		initialize: function(){
			//
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
		
	});

	return Report;

});