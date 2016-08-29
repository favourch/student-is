define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/admin/client.html'
	], function($, _, Backbone, clientTpl){

	var Client = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(clientTpl),

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

	return Client;

});