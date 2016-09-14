define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/stream.html'
	], function($, _, Backbone, streamTpl){

	var stream = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(streamTpl),

		events: {
			'click .editStream' : 'editStream',
			'click .editDone' : 'editDone',
			'click .deleteStream' : 'deleteStream'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$nameLabel = this.$(".stream-name");
			this.$teacherLabel = this.$(".stream-teacher");
			this.$abbrLabel = this.$(".stream-abbr");

			this.$nameInput = this.$(".stream-name-input");
			this.$teacherInput = this.$(".stream-teacher-input");
			this.$abbrInput = this.$(".stream-abbr-input");

			this.$editStream = this.$(".editStream");
			this.$editDone = this.$(".editDone");

			return this;
		},

		editStream: function(){
			//toggle visibility 
			this.$nameLabel.addClass("hidden");
			this.$abbrLabel.addClass("hidden");
			this.$teacherLabel.addClass("hidden");

			this.$nameInput.removeClass("hidden");
			this.$teacherInput.removeClass("hidden");
			this.$abbrInput.removeClass("hidden");

			this.$nameInput.focus();
			this.$editStream.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},

		editDone: function(){
			//toggle visibility 
			this.$nameLabel.removeClass("hidden");
			this.$teacherLabel.removeClass("hidden");
			this.$abbrLabel.removeClass("hidden");

			this.$nameInput.addClass("hidden");
			this.$teacherInput.addClass("hidden");
			this.$abbrInput.addClass("hidden");

			this.$editStream.removeClass("hidden");
			this.$editDone.addClass("hidden");

			//check the new values
			var name = this.$nameInput.val().trim();
			var abbr = this.$abbrInput.val().trim();
			var teacher = this.$teacherInput.val().trim();

			//ensure a name and abbreviation are provided
			if (name && abbr && teacher) {
				this.model.save({
					stream_name: name,
					stream_teacher: teacher,
					stream_abbr: abbr
				}, {
					url: baseURL + 'settings/streams/' + this.model.get('id') + '?token=' + tokenString,
				});

				this.model.trigger('change');
			} 		
		},

		deleteStream: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});
		}

	});

	return stream;

});