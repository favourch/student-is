define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/class.html'
	], function($, _, Backbone, classTpl){

	var Class = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(classTpl),

		events: {
			'click .editClass' : 'editClass',
			'click .editDone' : 'editDone',
			'click .deleteClass' : 'deleteClass'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$nameLabel = this.$(".class-name");
			this.$nameInput = this.$(".class-name-input");

			this.$editClass = this.$(".editClass");
			this.$editDone = this.$(".editDone");

			return this;

		},
		
		editClass: function(){

			//toggle visibility 
			this.$nameLabel.addClass("hidden");
			this.$nameInput.removeClass("hidden");

			this.$nameInput.focus();
			this.$editClass.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},		

		editDone: function(){
			//toggle visibility 
			this.$nameLabel.removeClass("hidden");
			this.$nameInput.addClass("hidden");

			this.$editClass.removeClass("hidden");
			this.$editDone.addClass("hidden");

			//check the new values
			var name = this.$nameInput.val().trim();

			//ensure a name and abbreviation are provided
			if (name) {
				this.model.save({
					class_name: name
				},{
					url: baseURL + 'settings/classes/' + this.model.get('id') + '?token=' + tokenString,
				});

				this.model.trigger('change');
			} 

		},

		deleteClass: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});		
		}

	});

	return Class;

});