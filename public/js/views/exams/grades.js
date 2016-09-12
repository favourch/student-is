define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/grades',
	'collections/users/classes',
	'views/exams/grade',
	'text!templates/settings/grades.html',
	'bootstrap',
	'jqueryui'
	], function($, _, Backbone, GradesCol, ClassesCol, GradeView, gradesTpl){

	var Grades = Backbone.View.extend({

		tagName: 'div',

		template: _.template(gradesTpl),

		events: {
			'submit #add-new-grade' : 'addGradePost'
		},

		initialize: function(){

			this.listenTo(GradesCol, 'add', this.addOneGrade);
			this.listenTo(GradesCol, 'reset', this.addAllGrades);

			GradesCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	

		},

		render: function(){
			
			this.$el.html(this.template());
			//define the table reference to use for adding individual grades
			this.$gradesList = this.$("#grades-list");

			return this;
			
		},

		addGradePost: function(evt){

			evt.preventDefault(); 
			var newGrade = {
				from_score: $("#new-grade-from").val(),
				to_score: $("#new-grade-to").val(),
				letter_grade: $("#new-grade-letter").val(),
				remarks: $("#new-grade-remarks").val()
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			GradesCol.create(newGrade, {
				url: baseURL + 'settings/grades?token=' + tokenString,
				success: function(){
					$(".success-message").html("grade added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');
					
					//empty the form
					$("#new-grade-from").val('');
					$("#new-grade-to").val('');
					$("#new-grade-remarks").val('');

					//fade out the modal
					$("#add_new_grade").modal("hide");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

				    }

				}
				
			});

		},

		addOneGrade: function(Grade){
			//remove the message for no grades yet, since there is a grade to add
			$('.no-grades-yet').hide();
			var view = new GradeView({
				model: Grade 
			});
			this.$gradesList.append(view.render().el);
		},

		addAllGrades: function(){
			this.$gradesList.empty();

			if(GradesCol.length === 0) {
				//there are not grades yet, show the no grades alert
				$('.no-grades-yet').show();
			}
			else {
				//remove the message for no grades yet, since there are grades to add
				$('.no-grades-yet').hide();
			
				GradesCol.each(this.addOneGrade, this);

			}
			
		}

	});

	return Grades;

});