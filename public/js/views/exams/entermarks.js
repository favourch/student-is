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
	'collections/users/terms',
	'text!templates/exams/chooseexam.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/subjects.html',
	'text!templates/exams/exams.html',
	'text!templates/exams/terms.html',
	'text!templates/exams/entermarks.html'
	], function($, _, Backbone, enterMark, Classes, Streams, Subjects, Exams, Marks, Grades, Terms, chooseExamTpl, classesTpl, streamsTpl, subjectsTpl, examsTpl, termsTpl, marksTpl){

	var Student = Backbone.View.extend({

		chooseExamTpl: _.template(chooseExamTpl),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		subjectsTpl: _.template(subjectsTpl),
		examsTpl: _.template(examsTpl),
		termsTpl: _.template(termsTpl),
		marksTpl: _.template(marksTpl),

		tagName: 'div',

		className: 'this-fluid-container',

		events: {
			'change #class_id' : 'setStreams',
			'submit form#entermarks' : 'enterMarks'
		},

		selected: {}, //the selected options for this enter marks

		initialize: function(){
			
			this.listenTo(Marks, 'reset', this.addAllMarks);
			this.listenTo(Classes, 'reset', this.setClasses);
			
			//fetch list of all terms for this client from the database
			Terms.fetch({
				data: $.param({ 
					token: tokenString
				})
			});	

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
			this.$main = $(".container-fluid");
			this.$classes = this.$("#classes-list");
			this.$streams = this.$("#streams-list");
			this.$subjects = this.$("#subjects-list");
			this.$exams = this.$("#exams-list");
			this.$terms = this.$("#terms-list");
			return this;
		},

		setClasses: function(){
			this.$classes.empty();
			
			this.$classes.html(this.classesTpl({
				regClasses: this.getClasses()
			}));
		
			this.setTerms();
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

		setTerms: function(){		

			this.$terms.html(this.termsTpl({
				regTerms: this.getTerms()
			}));

		},

		getTerms: function(){

			var regTerms = [];
			Terms.each(function(term){
				regTerms.push(term.toJSON());
			}, this);			

			return regTerms;

		},

		getGrades: function(){

			var regGrades = [];
			Grades.each(function(grade){
				regGrades.push(grade.toJSON());
			}, this);			

			return regGrades;

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
			
			//populate with the actual models/objects
			this.selected.class = Classes.where({id: selectedOps.class})[0].toJSON();
			this.selected.stream = (Streams.where({id: selectedOps.stream})[0]) ? Streams.where({id: selectedOps.stream})[0].toJSON() : null;
			this.selected.subject = Subjects.where({id: selectedOps.subject})[0].toJSON();
			this.selected.exam = Exams.where({id: selectedOps.exam})[0].toJSON();
			this.selected.term = Terms.where({id: selectedOps.term})[0].toJSON();
			this.selected.year = selectedOps.year;

			//get the registered exams for this class
			var exs = Exams.where({
				class_id: $("#class_id").val()
			});

			//load the template into view
			this.$main.html(this.marksTpl({
				selected: this.selected
			}));

			/*
			 This label is not detected -- i dont know why
			 */
			this.$marksList = $("#enter-marks-list");

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

		addOneMark: function(Mark){
			$('.no-students-yet').hide();
			Mark.set({exam: this.selected.exam});
			Mark.set({grades: this.getGrades()});

			var view = new enterMark({
				model: Mark 
			});			
			$("#enter-marks-list").append(view.render().el);
		},

		addAllMarks: function(){
			$("#enter-marks-list").empty();

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