define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/subject.html'
	], function($, _, Backbone, subjectTpl){

	var Subject = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(subjectTpl),

		events: {
			'click .editSubject' : 'editSubject',
			'click .editDone' : 'editDone',
			'click .deleteSubject' : 'deleteSubject'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$nameLabel = this.$(".subject-name");
			this.$abbrLabel = this.$(".subject-abbr");
			this.$descLabel = this.$(".subject-desc");

			this.$nameInput = this.$(".subject-name-input");
			this.$abbrInput = this.$(".subject-abbr-input");
			this.$descInput = this.$(".subject-desc-input");

			this.$editSubject = this.$(".editSubject");
			this.$editDone = this.$(".editDone");

			return this;
		},

		editSubject: function(){
			//toggle visibility 
			this.$nameLabel.addClass("hidden");
			this.$abbrLabel.addClass("hidden");
			this.$descLabel.addClass("hidden");

			this.$nameInput.removeClass("hidden");
			this.$abbrInput.removeClass("hidden");
			this.$descInput.removeClass("hidden");

			this.$nameInput.focus();
			this.$editSubject.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},		

		editDone: function(){
			//toggle visibility 
			this.$nameLabel.removeClass("hidden");
			this.$abbrLabel.removeClass("hidden");
			this.$descLabel.removeClass("hidden");

			this.$nameInput.addClass("hidden");
			this.$abbrInput.addClass("hidden");
			this.$descInput.addClass("hidden");

			this.$editSubject.removeClass("hidden");
			this.$editDone.addClass("hidden");

			//check the new values
			var name = this.$nameInput.val().trim();
			var abbr = this.$abbrInput.val().trim();
			var desc = this.$descInput.val().trim();

			//ensure a name and abbreviation are provided
			if (name && abbr) {
				this.model.save({
					subject_name: name,
					subject_abbr: abbr,
					description: desc
				}, {
					url: baseURL + 'settings/subjects/' + this.model.get('id') + '?token=' + tokenString,
				});

				this.model.trigger('change');
			} 

		},

		deleteSubject: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});
		}

	});

	return Subject;

});