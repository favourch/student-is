define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/students/student.html'
	], function($, _, Backbone, studentTpl){

	var Student = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(studentTpl),

		events: {
			'click .edit' : 'editUser',
			'click .destroy' : 'clear',
			'click .delete-client' : 'deleteClient'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		editUser: function(){
			this.$el.addClass('editing');
			this.$input.focus();
		},

		deleteClient: function(evt){
			evt.preventDefault();
			this.model.destroy();
		}

	});

	return Student;

});