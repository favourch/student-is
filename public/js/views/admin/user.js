define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/admin/user.html'
	], function($, _, Backbone, userTpl){

	var UserView = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(userTpl),

		events: {
			'click .edit' : 'editUser',
			'click .destroy' : 'clear'
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

		clear: function(){
			this.model.destroy();
		}

	});

	return UserView;

});