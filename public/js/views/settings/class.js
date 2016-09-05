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
			'click .destroy' : 'deleteClass'
		},

		initialize: function(){

			//some code here...			       
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		deleteClass: function(evt){
			evt.preventDefault();
			this.model.destroy();
		}

	});

	return Class;

});