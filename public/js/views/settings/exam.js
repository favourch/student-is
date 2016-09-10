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
			'click .editDone' : 'editDone',
			'click .deleteExam' : 'deleteExam'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$nameLabel = this.$(".exam-name");
			this.$abbrLabel = this.$(".exam-abbr");
			this.$descLabel = this.$(".exam-desc");
			this.$outofLabel = this.$(".exam-out-of");

			this.$nameInput = this.$(".exam-name-input");
			this.$abbrInput = this.$(".exam-abbr-input");
			this.$descInput = this.$(".exam-desc-input");
			this.$outofInput = this.$(".exam-out-of-input");

			this.$editExam = this.$(".editExam");
			this.$editDone = this.$(".editDone");

			return this;

		},

		editExam: function(){
			//toggle visibility 
			this.$nameLabel.addClass("hidden");
			this.$abbrLabel.addClass("hidden");
			this.$descLabel.addClass("hidden");
			this.$outofLabel.addClass("hidden");

			this.$nameInput.removeClass("hidden");
			this.$abbrInput.removeClass("hidden");
			this.$descInput.removeClass("hidden");
			this.$outofInput.removeClass("hidden");

			this.$nameInput.focus();
			this.$editExam.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},		

		editDone: function(){
			//toggle visibility 
			this.$nameLabel.removeClass("hidden");
			this.$abbrLabel.removeClass("hidden");
			this.$descLabel.removeClass("hidden");
			this.$outofLabel.addClass("hidden");

			this.$nameInput.addClass("hidden");
			this.$abbrInput.addClass("hidden");
			this.$descInput.addClass("hidden");
			this.$outofInput.removeClass("hidden");

			this.$editExam.removeClass("hidden");
			this.$editDone.addClass("hidden");

			//check the new values
			var name = this.$nameInput.val().trim();
			var abbr = this.$abbrInput.val().trim();
			var desc = this.$descInput.val().trim();
			var outof = this.$outofInput.val().trim();

			//ensure a name and abbreviation are provided
			if (name && abbr) {
				this.model.save({
					exam_name: name,
					exam_abbr: abbr,
					exam_out_of: outof,
					description: desc
				}, {
					url: baseURL + 'settings/exams/' + this.model.get('id') + '?token=' + tokenString,
				});

				this.model.trigger('change');
			} 

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