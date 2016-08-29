define([
	'jquery',
	'underscore',
	'backbone',
	], function($, _, Backbone){

	var Logout = Backbone.View.extend({

		initialize: function(token){

			var url = baseURL + "login.logout." + tokenString;

			$.ajax({
				url: url,
				type: "get",
				success: function(){
					window.location.replace(baseURL);
				}

			});
					
		}
		
	});

	return Logout;

});