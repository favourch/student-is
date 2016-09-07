define([
	'jquery',
	'underscore',
	'backbone',
	'collections/tmplt/classes',
	'collections/tmplt/streams',
	'collections/tmplt/subjects',
	'collections/tmplt/exams',
	'collections/tmplt/marks',
	'text!templates/exams/chooseexam.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/subjects.html',
	'text!templates/exams/exams.html',
	'text!templates/exams/marks-entries.html',
	'text!templates/exams/marks-entry.html'
	], function($, _, Backbone, Classes, Streams, Subjects, Exams, Marks, chooseExamTpl, classesTpl, streamsTpl, subjectsTpl, examsTpl, entriesTpl, entryTpl){

	var Student = Backbone.View.extend({

		chooseExamTpl: _.template(chooseExamTpl),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		subjectsTpl: _.template(subjectsTpl),
		examsTpl: _.template(examsTpl),
		entriesTpl: _.template(entriesTpl),
		entryTpl: _.template(entryTpl),

		tagName: 'div',

		events: {
			'change #class_id' : 'getStreams',
			'submit form#entermarks' : 'enterMarks'
		},

		initialize: function(){
			
			this.$main = $(".container-fluid");
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

		},

		enterMarks: function(evt){

			//prevent default form submission
			evt.preventDefault();

			//get the selected values
			var selectedOps = {
				class: $("#class_id").val(),
				stream: $("#stream_id").val(),
				subject: $("#subject_id").val(),
				exam: $("#exam_id").val(),
				term: $("#term_id").val(),
				year: $("#year").val()
			};
			var selected = {};
			//populate with the actual models/objects
			selected.class = Classes.where({id: selectedOps.class})[0].toJSON();
			selected.stream = Streams.where({id: selectedOps.stream})[0].toJSON();
			selected.subject = Subjects.where({id: selectedOps.subject})[0].toJSON();
			selected.exam = Exams.where({id: selectedOps.exam})[0].toJSON();
			selected.term = selectedOps.term;
			selected.year = selectedOps.year;

			//get the registered exams for this class
			var exs = Exams.where({
				class_id: $("#class_id").val()
			});
			var exms = [];
			$.each(exs, function(key, ex){
				exms.push(ex.toJSON());
			});
			selected.exams = exms;

			//load the template into view
			this.$main.html(this.entriesTpl({
				selected: selected
			}));

			//fetch the list of students with marks, if they already have
			var self = this;
			Marks.fetch({
				data: $.param({ 
					token: tokenString,
					class: selectedOps.class,
					stream: selectedOps.stream,
					subject: selectedOps.subject,
					exam: selectedOps.exam,
					term: selectedOps.term,
					year: selectedOps.year					
				}),
				success: self.loadMarks()
			});				

		},

		//display student marks after they are return, with option for entering new
		loadMarks: function(){
			
		}

	});

	return Student;

});