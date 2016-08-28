define([
	'jquery',
	'underscore',
	'backbone',
	'views/admin/addclient',
	'views/admin/adduser',
	'text!templates/partials/dash-header.html',
	'text!templates/admin/nav.html',
	'text!templates/admin/home.html',
	'tablesorter',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, addClient, addUser, HeaderTpl, NavTpl, HomeTpl){
	
	var Admin = Backbone.View.extend({

		el: $("#wrapper"),

		title: "Student Information System",

		homeTemplate: _.template(NavTpl + HomeTpl),

		initialize: function(page, token){

			this.$main = this.$(".container-fluid");

			switch(page){

				case 'home':

					$("title").html("Admin Panel - " + this.title);
					this.$el.html(this.homeTemplate({
						user: userData,
						token: tokenString
					}));

					//this will ensure the css is only added once
					$("#customCSS").remove();
					//this will add the current css to the page 
					$('head').append(HeaderTpl);

				 	break;
				case 'clients':

					this.clients();
					break;			

				case 'addClient':

					$("title").html("Add Client - " + this.title);
					var view = new addClient;
					this.$main.html(view.render().el);
					break;
					
				case 'users':

					this.users();
					break;

				case 'addUser':

					$("title").html("Add User - " + this.title);
					var view = new addUser;
					this.$main.html(view.render().el);
					break;

			}
			       
		}

	});

	return Admin;

});