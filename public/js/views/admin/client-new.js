define([
	'jquery',
	'underscore',
	'backbone',
	'collections/clients',
	'text!templates/admin/client-new.html',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, Clients, addClientTpl){

	var AddClient = Backbone.View.extend({

		tagName: 'div',

		template: _.template(addClientTpl),

		events: {
			'submit #add-client' : 'addClientPost'
		},

		initialize: function(){

			//some code here...			       
		},

		render: function(){

			this.$el.html(this.template());

			return this;

		},

		addClientPost: function(e){
			
			e.preventDefault(); 
			var newClient = {
				institution: $("#client-name").val(),
				first_name: $("#first-name").val(),
				last_name: $("#last-name").val(),
				email: $("#email").val(),
				password: $("#password").val(),
				address: $("#address").val(),
				code: $("#code").val(),
				city: $("#city").val(),
				phone: $("#phone").val(),
				user_type: 3
			};

			$(".submit-button").html("Please wait...");
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			Clients.create(newClient, {
				success: function(){
					$(".success-message").html("Client added successfully!").show(400);
					$(".submit-button").html("Submit");
				},
				error: function(){
					$(".error-message").html("Please check the errors below!").show(400);
					$(".submit-button").html("Submit");
				}
			});

			this.clearNewClient()
		},

		clearNewClient: function(){
			$("#client-name").val('');
			$("#first-name").val('');
			$("#last-name").val('');
			$("#email").val('');
			$("#password").val('');
			$("#address").val('');
			$("#code").val('');
			$("#city").val('');
			$("#phone").val('');
		}

	});

	return AddClient;

});