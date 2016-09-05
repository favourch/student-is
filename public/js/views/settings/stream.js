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
			'click .deleteStream' : 'deleteStream'
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

		editStream: function(){

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