define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/exams/viewmark.html'
	], function($, _, Backbone, viewMark){

	var Mark = Backbone.View.extend({

		viewMark: _.template(viewMark),

		tagName: 'tr',

		render: function(){
			this.$el.html(this.viewMark(this.model.toJSON()));
			return this;
		}

	});

	return Mark;

});