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
			'click .destroy' : 'deleteStream'
		},

		initialize: function(){

			//some code here...			       
		},

		render: function(){

			this.$el.html(this.template(this.model.toJSON()));
			return this;

		},

		deleteStream: function(evt){
			evt.preventDefault();
			this.model.destroy();
		}

	});

	return stream;

});