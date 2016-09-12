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

	var Terms = Backbone.View.extend({

		tagName: 'div',

		template: _.template(gradesTpl),

		events: {
			'submit #add-new-grade' : 'addGradePost'
		},

		initialize: function(){

			this.listenTo(GradesCol, 'add', this.addAllGrades);
			this.listenTo(GradesCol, 'reset', this.addAllGrades);

			var self = this;
			ClassesCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				}),
				success: self.loadGradesView
			});				

			GradesCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	

		},

		loadGradesView: function(){
			var csls = [];

			ClassesCol.each(function(cls){
				csls.push(cls.toJSON());
			}, this);

			$(".container-fluid").html(this.$el.html(this.template(csls)));
			//define the table reference to use for adding individual grades
			this.$gradesList = this.$("#grades-list");
			
		},

		addGradePost: function(evt){

			evt.preventDefault(); 
			var newGrade = {
				class_id: $("#new-grade-class").val(),
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
					$("#new-grade-class").val('');
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
			var view = new gradeView({
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
				
				ClassesCol.each(function(cls){
					var cls = cls.toJSON();
					//loop thrught the classes adding their grades one at a time
					var gHead = '<span class="lead">' + cls.class_name + '</span>';
					gHead += ' <button class="btn btn-small btn-primary" data-toggle="modal" data-target="#add_new_grade"><i class="fa fa-plus"></i> Add New Grade</button>';
					this.$gradesList.append(gHead);

					var gds = GradesCol.where({class_id: cls.id});
					gds.each(this.addOneGrade, this);
				}, this);

			}
			
		}

	});

	return Grades;

});