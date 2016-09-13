define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/classes',
	'collections/users/teachers',
	'views/settings/class',
	'text!templates/settings/classes.html',
	'bootstrap'
	], function($, _, Backbone, ClassesCol, Teachers, ClassView, classesTpl){

	var Classes = Backbone.View.extend({

		tagName: 'div',

		template: _.template(classesTpl),

		events: {
			'submit #add-new-class' : 'addClassPost'
		},

		initialize: function(){
			
			this.listenTo(ClassesCol, 'add', this.addOneClass);
			this.listenTo(ClassesCol, 'reset', this.addAllClasses);

			//this.listenTo(Teachers, 'reset', this.render);
			Teachers.fetch({
				data: $.param({ 
					token: tokenString
				})
			});
				
			ClassesCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	



		},

		render: function(){
			$(".container-fluid").html(this.$el.html(this.template({
				teachers: this.getTeachers()
			})));
			//define the table reference to use for adding individual classes
			this.$classesList = this.$("#classes-table");
		},

		getTeachers: function(){
			var teachers = [];
			Teachers.each(function(teacher){
				teachers.push(teacher.toJSON());
			}, this);
			return teachers;
		},

		addClassPost: function(evt){

			evt.preventDefault(); 
			var newClass = {
				class_name: $("#new-class-name").val(),
				class_teacher: $("#new-class-teacher").val(),
				description: $("#new-class-description").val()
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			ClassesCol.create(newClass, {
				url: baseURL + 'settings/classes?token=' + tokenString,
				success: function(){
					$(".success-message").html("Class added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');
					
					//empty the form
					$("#new-class-name").val('');
					$("#new-class-description").val('');
					$("#new-class-teacher").val('');				

					//fade out the modal
					$("#add_new_class").modal("hide");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

				    }

				}
				
			});

		},

		addOneClass: function(Class){
			//remove the message for no classes yet, since there is a class to add
			$('.no-classes-yet').hide();
			Class.set({teachers: this.getTeachers()});
			var view = new ClassView({
				model: Class 
			});
			this.$classesList.append(view.render().el);
		},

		addAllClasses: function(){
			this.render();
			this.$classesList.empty();

			if(ClassesCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-classes-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-classes-yet').hide();
				ClassesCol.each(this.addOneClass, this);
			}
			
		}

	});

	return Classes;

});