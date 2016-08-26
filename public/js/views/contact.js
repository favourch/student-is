define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/contact.html',
	'bootstrap'
	], function($, _, Backbone, ContactTemplate){

	var ContactView = Backbone.View.extend({

		el: $(".main-body"),
		
		title: "Contact - Student Information System",

		template: _.template(ContactTemplate),

		initialize: function(){
			$("title").html(this.title);
			this.$el.html(this.template());
		}
		
	});

	return ContactView;

});