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
			'submit .save-mark' : 'saveMark',
			'dblclick .exam-score' : 'editMark',
			'click .editMark' : 'editMark',
			'click .editDone' : 'saveMark',
			'blur .exam-score-input' : 'saveMark'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
		},

		render: function(){
			this.$el.html(this.markTpl(this.model.toJSON()));
			this.$scoreLabel = this.$(".exam-score");
			this.$scoreInput = this.$(".exam-score-input");

			this.$editMark = this.$(".editMark");
			this.$editDone = this.$(".editDone");
			return this;
		},

		editMark: function(){
			this.$scoreLabel.addClass('hidden');
			this.$scoreInput.removeClass('hidden');

			this.$editMark.addClass('hidden');
			this.$editDone.removeClass('hidden');
		},

		editDone: function(){
			this.$scoreLabel.removeClass('hidden');
			this.$scoreInput.addClass('hidden');

			this.$editMark.removeClass('hidden');
			this.$editDone.addClass('hidden');
		},

		saveMark: function(evt){
			//check for form submit
			if (evt) evt.preventDefault();

			//check for update or new record
			if (this.model.get('id')) {
				this.model.save({
					exam_score: this.$scoreInput.val().trim()
				},{
					url: baseURL + 'marks/marks/' + this.model.get('id') + '?token=' + tokenString
				});			
			} 
			else {
				this.model.save({
					exam_score: this.$scoreInput.val().trim()
				},{
					url: baseURL + 'marks/marks/' + '?token=' + tokenString
				});			
			}
			
			this.model.trigger('change');		
		}

	});

	return Entry;

});