define([
	'jquery',
	'underscore',
	'backbone',
	'collections/tmplt/classes',
	'collections/tmplt/streams',
	'collections/tmplt/subjects',
	'collections/tmplt/exams',
	'text!templates/exams/chooseexam.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/subjects.html',
	'text!templates/exams/exams.html'
	], function($, _, Backbone, Classes, Streams, Subjects, Exams, chooseExamTpl, classesTpl, streamsTpl, subjectsTpl, examsTpl){

	var Student = Backbone.View.extend({

		chooseExamTpl: _.template(chooseExamTpl),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		subjectsTpl: _.template(subjectsTpl),
		examsTpl: _.template(examsTpl),

		tagName: 'div',

		events: {
			'change #class_id' : 'getStreams'
		},

		initialize: function(){
			
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

			//fetch list of all subjects for this client from the database
			Subjects.fetch({
				data: $.param({ 
					token: tokenString
				})
			});				

			//fetch list of all exams for this client from the database
			Exams.fetch({
				data: $.param({ 
					token: tokenString
				})
			});		
		},

		render: function(){
			this.$el.html(this.chooseExamTpl());
			this.$classes = this.$("#classes-list");
			this.$streams = this.$("#streams-list");
			this.$subjects = this.$("#subjects-list");
			this.$exams = this.$("#exams-list");
			return this;
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

			//update the subjects and exams
			this.getSubjects().getExams();

		},		

		getSubjects: function(){

			var classID = $("#class_id").val();
			var regSubjects = [];
			var subjects = Subjects.where({
				class_id: classID
			});

			$.each(subjects, function(key, oneSubject){
				regSubjects.push(oneSubject.toJSON());
			});			

			this.$subjects.html(this.subjectsTpl({
				regSubjects: regSubjects
			}));

			return this;

		},

		getExams: function(){

			var classID = $("#class_id").val();
			var regExams = [];
			var exams = Exams.where({
				class_id: classID
			});

			$.each(exams, function(key, oneExam){
				regExams.push(oneExam.toJSON());
			});			

			this.$exams.html(this.examsTpl({
				regExams: regExams
			}));

		}
	});

	return Student;

});