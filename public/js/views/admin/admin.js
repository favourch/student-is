define([
	'jquery',
	'underscore',
	'backbone',
	'views/admin/client',
	'views/admin/client-new',
	'views/admin/user',
	'views/admin/user-new',
	'collections/admin/users',
	'collections/admin/clients',
	'text!templates/partials/dash-header.html',
	'text!templates/admin/nav.html',
	'text!templates/admin/home.html',
	'text!templates/admin/users.html',
	'text!templates/admin/clients.html',
	'jqueryui',
	'bootstrap'
	], function(
		$, _, Backbone, ClientView, clientNew, UserView, userNew, UsersCol, ClientsCol, HeaderTpl, 
		NavTpl, HomeTpl, UsersTpl, ClientsTpl ){
	
	var Admin = Backbone.View.extend({

		el: $("#wrapper"),

		title: "Student Information System",

		homeTemplate: _.template(NavTpl + HomeTpl),

		usersTpl:  _.template(UsersTpl),

		clientsTpl:  _.template(ClientsTpl),

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

					$("title").html("Clients - " + this.title);
					
					this.$main.html(this.clientsTpl({
						baseURL: baseURL,
						token: tokenString
					}));
					this.$clientsList = this.$("#clients-table");
					
					this.listenTo(ClientsCol, 'add', this.addOneClient);
					this.listenTo(ClientsCol, 'reset', this.addAllClients);

					ClientsCol.fetch({
						reset: true
					});

					break;			

				case 'clientnew':

					$("title").html("Add Client - " + this.title);
					var view = new clientNew;
					this.$main.html(view.render().el);
					break;
					
				case 'users':

					$("title").html("Users - " + this.title);
					
					this.$main.html(this.usersTpl({
						baseURL: baseURL,
						token: tokenString
					}));
					this.$usersList = this.$("#users-table");
					
					this.listenTo(UsersCol, 'add', this.addOneUser);
					this.listenTo(UsersCol, 'reset', this.addAllUsers);

					UsersCol.fetch({
						reset: true
					});

					break;

				case 'usernew':

					$("title").html("Add User - " + this.title);
					var view = new userNew;
					this.$main.html(view.render().el);
					break;

			}
			       
		},

		addOneUser: function(user){
			var view = new UserView({
				model: user 
			});
			this.$usersList.append(view.render().el);
		},

		addAllUsers: function(){
			this.$usersList.empty();
			UsersCol.each(this.addOneUser, this);
		},		

		addOneClient: function(client){
			var view = new ClientView({
				model: client 
			});
			this.$clientsList.append(view.render().el);
		},

		addAllClients: function(){
			this.$clientsList.empty();
			ClientsCol.each(this.addOneClient, this);
		},
	});

	return Admin;

});