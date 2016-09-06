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
			'click .deleteStudent' : 'deleteStudent'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		deleteStudent: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});
		}

	});

	return Student;

});