define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/students',
	'collections/users/classes',
	'collections/users/streams',
	'text!templates/students/studentnew.html',
	'text!templates/students/classes.html',
	'text!templates/students/streams.html',
	'jqueryui',
	'bootstrap'
	], function($, _, Backbone, Students, Classes, Streams, StudentTpl, classesTpl, streamsTpl){

	var NewStudent = Backbone.View.extend({

		tagName: 'div',

		title: "New Student - Student Information System",

		events: {
			'submit form#new-student' : 'addStudent',
			'change #class_id' : 'getStreams'
		},

		template: _.template(StudentTpl),

		classesTpl: _.template(classesTpl),

		streamsTpl: _.template(streamsTpl),

		initialize: function(){
			
			$("title").html(this.title);
			
			//fetch list of all classes for this class from the database
			var self = this;
			Classes.fetch({
				data: $.param({ 
					token: tokenString
				}),
				success: function(data){
					self.setClasses();
				}
			});					

			//fetch list of all streams for this client from the database
			Streams.fetch({
				data: $.param({ 
					token: tokenString
				})
			});		

		},

		render: function(){
			this.$el.html(this.template());
			this.$classes = this.$("#classes-list");	
			this.$streams = this.$("#streams-list");	
			return this;
		},

		addStudent: function(evt){
			evt.preventDefault();
			var student = {
				reg_number: $("#reg_number").val(),
				first_name: $("#first_name").val(),
				middle_name: $("#middle_name").val(),
				last_name: $("#last_name").val(),
				dob: $("#dob").val(),
				pob: $("#pob").val(),
				bcn: $("#bcn").val(),
				sex: $("#sex").val(),
				nationality: $("#nationality").val(),
				doa: $("#doa").val(),
				class_id: $("#class_id").val(),
				stream_id: ($("#stream_id").val()) ?  $("#stream_id").val() : '',
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
				url: baseURL + 'students/students?token=' + tokenString,
				success: function(){
					
					$(".success-message").html("Student added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i>Save');

					//empty the form
					$("#reg_number").val(''),
					$("#first_name").val(''),
					$("#middle_name").val(''),
					$("#last_name").val(''),
					$("#dob").val(''),
					$("#pob").val(''),
					$("#bcn").val(''),
					$("#sex").val(''),
					$("#nationality").val(''),
					$("#doa").val(''),
					$("#class_id").val(''),
					$("#stream_id").val(''),
					$("#address").val(''),
					$("#code").val(''),
					$("#town").val(''),
					$("#pg_f_name").val(''),
					$("#pg_l_name").val(''),
					$("#pg_email").val(''),
					$("#pg_phone").val('')	

				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i>Save');

				    }

				}
				
			});

		},

		setClasses: function(){
			this.$classes.empty();
			var regClasses = [];

			Classes.each(function(oneClass){
				regClasses.push(oneClass.toJSON());
			}, this);

			this.$classes.html(this.classesTpl({
				regClasses: regClasses
			}));
	
		},

		getStreams: function(){

			var classID = $("#class_id").val();
			var regStreams = [];
			var streams = Streams.where({
				class_id: classID
			});

			$.each(streams, function(key, oneStream){
				regStreams.push(oneStream.toJSON());
			});			

			this.$streams.html(this.streamsTpl({
				regStreams: regStreams
			}));

		}
		
	});

	return NewStudent;

});