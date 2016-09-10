define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/exams/entry-view.html'
	], function($, _, Backbone, entryTpl){

	var Entry = Backbone.View.extend({

		entryTpl: _.template(entryTpl),

		tagName: 'tr',

		render: function(){
			this.$el.html(this.entryTpl(this.model.toJSON()));
			return this;
		}

	});

	return Entry;

});