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

			$(".container-fluid").html(this.$el.html(this.template()));
			//define the table reference to use for adding individual classes
			this.$classesList = this.$("#classes-table");
			
			this.listenTo(ClassesCol, 'add', this.addOneClass);
			this.listenTo(ClassesCol, 'reset', this.addAllClasses);

			ClassesCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	

		},

		addClassPost: function(evt){

			evt.preventDefault(); 
			var newClass = {
				name: $("#new-class-name").val(),
				description: $("#class-description").val()
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
			//remove the message for no classes yet, since there is a class to add
			$('.no-classes-yet').hide();
			var view = new ClassView({
				model: Class 
			});
			this.$classesList.append(view.render().el);
		},

		addAllClasses: function(){
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