define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/marks',
	'views/exams/entermarks',
	'views/exams/viewmarks',	
	'views/exams/grades',
	'views/exams/spreadsheets',
	'views/exams/reports',
	], function($, _, Backbone, MarksCol, enterMarks, viewMarks, viewGrades, viewSpreadsheets, viewReports){

	var Exams = Backbone.View.extend({

		title: "Student Information System",
		 
		initialize: function(page, token){
			
			this.$main = $(".container-fluid");

			switch(page){

				case 'entermarks':
					
					//update page title
					$("title").html("Enter Marks - " + this.title);
					
					//load the enter marks view
					var view = new enterMarks;
					this.$main.html(view.render().el);

					break;
				case 'viewmarks':
					
					//update page title
					$("title").html("Enter Marks - " + this.title);
					
					//load the view marks view
					var view = new viewMarks;
					this.$main.html(view.render().el);

					break;
				case 'grading':
					//update page title
					$("title").html("Grading - " + this.title);
					
					//load the view marks view
					var view = new viewGrades;
					this.$main.html(view.render().el);
					break;				
				case 'spreadsheets':
					//update page title
					$("title").html("Spreadsheets - " + this.title);
					
					//load the view marks view
					var view = new viewSpreadsheets;
					this.$main.html(view.render().el);
					break;
				case 'reports':
					//update page title
					$("title").html("Reports - " + this.title);
					
					//load the view marks view
					var view = new viewReports;
					this.$main.html(view.render().el);
					break;

			}
	       
		}
		
	});

	return Exams;

});