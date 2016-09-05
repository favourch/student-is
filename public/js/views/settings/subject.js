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
			'click .deleteSubject' : 'deleteSubject'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		editSubject: function(){

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