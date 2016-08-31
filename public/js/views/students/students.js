define([
	'jquery',
	'underscore',
	'backbone',
	'views/students/all',
	'views/students/new'
	], function($, _, Backbone, All, Student){

	var Admissions = Backbone.View.extend({
		
		initialize: function(page, token){
			
			$("title").html(this.title);

			switch(page){

				case 'all':
					var view = new All;
					$(".container-fluid").html(view.render().el);

					break;
				case 'new':
					var view = new Student;
					$(".container-fluid").html(view.render().el);

					break;
			}
	       
		}
		
	});

	return Admissions;

});