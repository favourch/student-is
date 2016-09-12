define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/grade.html'
	], function($, _, Backbone, gradeTpl){

	var Term = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(gradeTpl),

		events: {
			'click .editGrade' : 'editGrade',
			'click .editDone' : 'editDone',
			'click .deleteGrade' : 'deleteGrade'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$scoreLabel = this.$(".grade-score");
			this.$gradeLetter = this.$(".grade-letter");
			this.$gradeRemarks = this.$(".grade-remarks");

			this.$fromInput = this.$(".grade-from-input");
			this.$toInput = this.$(".grade-to-input");
			this.$letterInput = this.$(".grade-letter-input");
			this.$remarksInput = this.$(".grade-remarks-input");

			this.$editGrade = this.$(".editGrade");
			this.$editDone = this.$(".editDone");

			return this;

		},
		
		editGrade: function(){

			//toggle visibility 
			this.$scoreLabel.addClass("hidden");
			this.$gradeLetter.addClass("hidden");
			this.$gradeRemarks.addClass("hidden");

			this.$fromInput.removeClass("hidden");
			this.$toInput.removeClass("hidden");
			this.$letterInput.removeClass("hidden");
			this.$remarksInput.removeClass("hidden");

			this.$fromInput.focus();
			this.$editGrade.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},		

		editDone: function(){
			//toggle visibility 
			this.$scoreLabel.removeClass("hidden");
			this.$gradeLetter.removeClass("hidden");
			this.$gradeRemarks.removeClass("hidden");

			this.$fromInput.addClass("hidden");
			this.$toInput.addClass("hidden");
			this.$letterInput.addClass("hidden");
			this.$remarksInput.addClass("hidden");

			this.$editGrade.removeClass("hidden");
			this.$editDone.addClass("hidden");

			this.model.save({
				from_score: this.$fromInput.val().trim(),
				to_score: this.$toInput.val().trim(),
				letter_grade: this.$letterInput.val().trim(),
				remarks: this.$remarksInput.val().trim()
			},{
				url: baseURL + 'settings/grades/' + this.model.get('id') + '?token=' + tokenString,
			});

			this.model.trigger('change');

		},

		deleteGrade: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});		
		}

	});

	return Term;

});