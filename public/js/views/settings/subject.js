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
			'click .destroy' : 'deleteSubject'
		},

		initialize: function(){

			//some code here...			       
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		deleteSubject: function(evt){
			evt.preventDefault();
			this.model.destroy();
		}

	});

	return Subject;

});