define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/classes',
	'views/settings/class',
	'text!templates/settings/classes.html',
	'bootstrap'
	], function($, _, Backbone, ClassesCol, ClassView, classesTpl){

	var Classes = Backbone.View.extend({

		tagName: 'div',

		template: _.template(classesTpl),

		events: {
			'submit #add-new-class' : 'addClassPost'
		},

		initialize: function(){
			
			//include the classes display template html into the view
			this.$el.html(this.template({
				token: tokenString
			}));

			//define the table reference to use for adding individual classes
			this.$classesList = $("#classes-list");
			
			this.listenTo(ClassesCol, 'add', this.addOneClass);
			this.listenTo(ClassesCol, 'reset', this.addAllClasses);

			ClassesCol.fetch({
				reset: true
			});	

		},

		render: function(){

			this.$el.html(this.template());
			return this;

		},

		addClassPost: function(evt){

			evt.preventDefault(); 
			var newClass = {
				name: $("#new-class-name").val(),
				streams: {},
				subjects: {},
				exams: {},
				population: 0
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			ClassesCol.create(newClass, {
				success: function(){
					$(".success-message").html("Class added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');
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
			var view = new ClassView({
				model: Class 
			});
			this.$classesList.append(view.render().el);
		},

		addAllClasses: function(){
			this.$classesList.empty();

			if(ClassesCol.length === 0) {
				this.$classesList.html('<p class="alert alert-danger"> There are no registered classes yet.</p>');
			}
			else {
				ClassesCol.each(this.addOneClass, this);
			}
			
		}

	});

	return Classes;

});