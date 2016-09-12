define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/users',
	'views/settings/classes',
	'views/settings/classview',
	'views/settings/teachers',
	'views/settings/terms',
	], function($, _, Backbone, usersView, classesView, classView, teachersView, termsView){

	var Settings = Backbone.View.extend({

		title: "Student Information System",
		 
		initialize: function(page, token){
			
			this.$main = $(".container-fluid");

			switch(page){

				case 'users':
					//update the page title
					$("title").html("Users - " + this.title);
					//load the users view
					var view = new usersView;
					break;
				case 'classes':
					//update the page title
					$("title").html("Classes - " + this.title);
					//load the classes view
					var view = new classesView();
					break;
				case 'viewclass':
					//update the page title
					$("title").html("Class View - " + this.title);
					//load the classes view
					var view = new classView(token);
					break;
				case 'teachers':
					//update the page title
					$("title").html("Teachers - " + this.title);
					//load the classes view
					var view = new teachersView(token);
					break;
				case 'settings':
					//update the page title
					$("title").html("Settings - " + this.title);
					//load the classes view
					var viewT = new termsView(token);
					break;
			}
	       
		}
		
	});

	return Settings;

});