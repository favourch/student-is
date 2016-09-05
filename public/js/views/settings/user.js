define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/user.html'
	], function($, _, Backbone, userTpl){

	var User = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(userTpl),

		events: {
			'click .destroy' : 'deleteUser'
		},

		initialize: function(){

			//some code here...			       
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		deleteUser: function(evt){
			evt.preventDefault();
			this.model.destroy();
		}

	});

	return User;

});