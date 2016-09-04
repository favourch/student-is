define([
	'jquery',
	'underscore',
	'backbone',
	'collections/students',
	'text!templates/students/new.html',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, Students, StudentTpl){

	var NewStudent = Backbone.View.extend({

		tagName: 'div',

		title: "New Student - Student Information System",

		events: {
			'submit form#new-student' : 'addStudent'
		},

		template: _.template(StudentTpl),

		initialize: function(){
			
			$("title").html(this.title);
			       
		},

		render: function(){
			this.$el.html(this.template());			
			return this;
		},

		addStudent: function(evt){
			evt.preventDefault();
			var student = {
				first_name: $("#first_name").val(),
				middle_name: $("#middle_name").val(),
				last_name: $("#last_name").val(),
				dob: $("#dob").val(),
				pob: $("#pob").val(),
				bcn: $("#bcn").val(),
				sex: $("#sex").val(),
				nationality: $("#nationality").val(),
				doa: $("#doa").val(),
				clas: $("#class").val(),
				address: $("#address").val(),
				code: $("#code").val(),
				town: $("#town").val(),
				pg_f_name: $("#pg_f_name").val(),
				pg_l_name: $("#pg_l_name").val(),
				pg_email: $("#pg_email").val(),
				pg_phone: $("#pg_phone").val()
			};

			$(".submit-button").html("Please wait...");
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			Students.create(student, {
				success: function(){
					$(".success-message").html("Student added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i>Save');
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html("Submit");

				    }

				}
				
			});

		}
		
	});

	return NewStudent;

});