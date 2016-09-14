define([
	'jquery',
	'underscore',
	'backbone',
	'views/exams/entermark',
	'collections/users/classes',
	'collections/users/streams',
	'collections/users/subjects',
	'collections/users/exams',
	'collections/users/marks',
	'collections/users/grades',
	'text!templates/exams/chooseexam.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/subjects.html',
	'text!templates/exams/exams.html',
	'text!templates/exams/entermarks.html'
	], function($, _, Backbone, enterMark, Classes, Streams, Subjects, Exams, Marks, Grades, chooseExamTpl, classesTpl, streamsTpl, subjectsTpl, examsTpl, marksTpl){

	var Student = Backbone.View.extend({

		chooseExamTpl: _.template(chooseExamTpl),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		subjectsTpl: _.template(subjectsTpl),
		examsTpl: _.template(examsTpl),
		marksTpl: _.template(marksTpl),

		tagName: 'div',

		events: {
			'change #class_id' : 'setStreams',
			'submit form#entermarks' : 'enterMarks'
		},

		initialize: function(){
			
			this.$main = $(".container-fluid");
			this.listenTo(Marks, 'reset', this.addAllMarks);
			this.listenTo(Classes, 'reset', this.setClasses);

			//fetch list of all classes for this class from the database
			var self = this;
			Classes.fetch({
				data: $.param({ 
					token: tokenString
				}),
				reset: true
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

			//fetch list of all grades for this client from the database
			Grades.fetch({
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
			
			this.$classes.html(this.classesTpl({
				regClasses: this.getClasses()
			}));
	
		},

		getClasses: function(){
			var regClasses = [];

			Classes.each(function(oneClass){
				regClasses.push(oneClass.toJSON());
			}, this);

			return regClasses;
	
		},

		setStreams: function(){	

			this.$streams.html(this.streamsTpl({
				regStreams: this.getStreams()
			}));

			//update the subjects and exams
			this.setSubjects().setExams();

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

			return regStreams;

		},		

		setSubjects: function(){		

			this.$subjects.html(this.subjectsTpl({
				regSubjects: this.getSubjects()
			}));

			return this;

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

			return regSubjects;

		},

		setExams: function(){		

			this.$exams.html(this.examsTpl({
				regExams: this.getExams()
			}));

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

			return regExams;

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

			//load the template into view
			this.$main.html(this.marksTpl({
				selected: selected
			}));

			this.$marksList = $("#marks-entries-list");

			//fetch the list of students with marks, if they already have
			var that = this;
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
				reset: true
			});				

		},

		addOneMark: function(mark){
			$('.no-students-yet').hide();
			var view = new enterMark({
				model: mark 
			});			
			this.$marksList.append(view.render().el);
		},

		addAllMarks: function(){
			this.$marksList.empty();

			if(Marks.length == 0) {
				//there are not classes yet, show the no classes alert
				$('.no-students-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-students-yet').hide();
				Marks.each(this.addOneMark, this);
			}
			
		}

	});

	return Student;

});