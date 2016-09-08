define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/exams/marks-entry.html'
	], function($, _, Backbone, entryTpl){

	var Entry = Backbone.View.extend({

		entryTpl: _.template(entryTpl),

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
			this.$el.html(this.entryTpl(this.model.toJSON()));
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