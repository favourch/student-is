define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/term.html'
	], function($, _, Backbone, termTpl){

	var Term = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(termTpl),

		events: {
			'click .editTerm' : 'editTerm',
			'click .editDone' : 'editDone',
			'click .deleteTerm' : 'deleteTerm'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$nameLabel = this.$(".term-name");
			this.$abbrLabel = this.$(".term-abbr");
			this.$startLabel = this.$(".term-start");
			this.$endLabel = this.$(".term-end");

			this.$nameInput = this.$(".term-name-input");
			this.$abbrInput = this.$(".term-abbr-input");
			this.$startInput = this.$(".term-start-input");
			this.$endInput = this.$(".term-end-input");

			this.$editTerm = this.$(".editTerm");
			this.$editDone = this.$(".editDone");

			return this;

		},
		
		editTerm: function(){

			//toggle visibility 
			this.$nameLabel.addClass("hidden");
			this.$abbrLabel.addClass("hidden");
			this.$startLabel.addClass("hidden");
			this.$endLabel.addClass("hidden");

			this.$nameInput.removeClass("hidden");
			this.$abbrInput.removeClass("hidden");
			this.$startInput.removeClass("hidden");
			this.$endInput.removeClass("hidden");

			this.$nameInput.focus();
			this.$editTerm.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},		

		editDone: function(){
			//toggle visibility 
			this.$nameLabel.removeClass("hidden");
			this.$abbrLabel.removeClass("hidden");
			this.$startLabel.removeClass("hidden");
			this.$endLabel.removeClass("hidden");

			this.$nameInput.addClass("hidden");
			this.$abbrInput.addClass("hidden");
			this.$startInput.addClass("hidden");
			this.$endInput.addClass("hidden");

			this.$editTerm.removeClass("hidden");
			this.$editDone.addClass("hidden");

			this.model.save({
				term_name: this.$nameInput.val().trim(),
				term_abbr: this.$abbrInput.val().trim(),
				start_date: this.$startInput.val().trim(),
				end_date: this.$endInput.val().trim()
			},{
				url: baseURL + 'settings/terms/' + this.model.get('id') + '?token=' + tokenString,
			});

			this.model.trigger('change');

		},

		deleteTerm: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});		
		}

	});

	return Term;

});