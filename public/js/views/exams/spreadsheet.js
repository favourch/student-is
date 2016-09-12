define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/exams/spreadsheet.html'
	], function($, _, Backbone, spreadsheetTpl){

	var Spreadsheet = Backbone.View.extend({

		template: _.template(spreadsheetTpl),

		tagName: 'tr',

		initialize: function(){
			//
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
		
	});

	return Spreadsheet;

});