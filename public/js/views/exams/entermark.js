define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/exams/entermark.html'
	], function($, _, Backbone, markTpl){

	var Entry = Backbone.View.extend({

		markTpl: _.template(markTpl),

		tagName: 'tr',

		events: {
			'submit .save-marks' : 'saveMark',
			'click .editMark' : 'editMark',
			'blur .mark-input' : 'saveMark'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
		},

		render: function(){
			this.$el.html(this.markTpl(this.model.toJSON()));
			this.$input = this.$(".mark-input");
			return this;
		},

		editMark: function(){
			//input calling
		},		

		saveMark: function(evt){
			evt.preventDefault();
			alert(this.$input.val());
		}

	});

	return Entry;

});