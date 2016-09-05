define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/users',
	'views/settings/classes'
	], function($, _, Backbone, usersView, classesView){

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
					this.$main.html(view.render().el);
					break;
				case 'classes':
					//update the page title
					$("title").html("Classes - " + this.title);
					//load the classes view
					var view = new classesView();
					break;
				case 'viewclass':

					break;
			}
	       
		}
		
	});

	return Settings;

});