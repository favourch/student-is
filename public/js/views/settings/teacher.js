define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/teacher.html'
	], function($, _, Backbone, teacherTpl){

	var Teacher = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(teacherTpl),

		events: {
			'click .editTeacher' : 'editTeacher',
			'dblclick .editInfo' : 'editTeacher',
			'click .editDone' : 'editDone',
			'click .deleteTeacher' : 'deleteTeacher'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$fnameLabel = this.$(".fname");
			this.$lnameLabel = this.$(".lname");
			this.$titleLabel = this.$(".title");

			this.$fnameInput = this.$(".fname-input");
			this.$lnameInput = this.$(".lname-input");
			this.$titleInput = this.$(".title-input");

			this.$editTeacher = this.$(".editTeacher");
			this.$editDone = this.$(".editDone");

			return this;		 
		},

		editTeacher: function(){
			//toggle visibility 
			this.$fnameLabel.addClass("hidden");
			this.$lnameLabel.addClass("hidden");
			this.$titleLabel.addClass("hidden");

			this.$fnameInput.removeClass("hidden");
			this.$lnameInput.removeClass("hidden");
			this.$titleInput.removeClass("hidden");

			this.$titleInput.focus();
			this.$editTeacher.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},

		editDone: function(){
			//toggle visibility 
			this.$fnameLabel.removeClass("hidden");
			this.$lnameLabel.removeClass("hidden");
			this.$titleLabel.removeClass("hidden");
			
			this.$fnameInput.addClass("hidden");
			this.$lnameInput.addClass("hidden");
			this.$titleInput.addClass("hidden");

			this.$editTeacher.removeClass("hidden");
			this.$editDone.addClass("hidden");

			//check the new values
			var fname = this.$fnameInput.val().trim();
			var lname = this.$lnameInput.val().trim();
			var title = this.$titleInput.val().trim();

			//ensure a name and abbreviation are provided
			if (fname && lname && title) {
				this.model.save({
					first_name: fname,
					last_name: lname,
					teacher_title: title
				},{
					url: baseURL + 'settings/teachers/' + this.model.get('id') + '?token=' + tokenString,
				});

				this.model.trigger('change');
			} 
					
		},
		deleteTeacher: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});		
		}

	});

	return Teacher;

});