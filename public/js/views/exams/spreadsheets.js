define([
	'jquery',
	'underscore',
	'backbone',
	'views/exams/spreadsheet',
	'collections/users/spreadsheets',
	'collections/users/classes',
	'collections/users/streams',
	'collections/users/subjects',
	'collections/users/exams',
	'collections/users/terms',
	'collections/users/grades',
	'collections/users/students',
	'collections/users/teachers',
	'text!templates/exams/choosesheet.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/terms.html',
	'text!templates/exams/spreadsheets.html',
	'text!templates/exams/spreadsheets-analysis.html'
	], function($, _, Backbone, SpreadsheetView, SpreadsheetsCol, Classes, Streams, Subjects, Exams, Terms, Grades, Students, Teachers, chooseSheetTpl, classesTpl, streamsTpl, termsTpl, spreadsheetsTpl, spreadsheetsAnalysisTpl){

	var Spreadsheets = Backbone.View.extend({

		chooseSheetTpl: _.template(chooseSheetTpl),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		termsTpl: _.template(termsTpl),
		spreadsheetsTpl: _.template(spreadsheetsTpl),

		tagName: 'div',

		thisClass: '', //the class for getting the spreadsheet

		events: {
			'change #class_id' : 'setStreams',
			'submit form#getspreadsheet' : 'getSpreadsheet'
		},

		initialize: function(){
			
			this.$main = $(".container-fluid");
			this.listenTo(SpreadsheetsCol, 'reset', this.addAllRows);
			this.listenTo(Classes, 'reset', this.setClasses);
			this.listenTo(Terms, 'reset', this.setTerms);

			//fetch list of all classes for this class from the database
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

			//fetch list of all terms for this client from the database
			Terms.fetch({
				data: $.param({ 
					token: tokenString
				}),
				reset: true
			});	
			
			//fetch list of all grades for this client from the database
			Grades.fetch({
				data: $.param({ 
					token: tokenString
				}),
				reset: true
			});				

		},

		render: function(){
			this.$el.html(this.chooseSheetTpl());
			this.$classes = this.$("#classes-list");
			this.$streams = this.$("#streams-list");
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

		getSpreadsheet: function(evt){

			//prevent default form submission
			evt.preventDefault();

			//get the selected values
			var selectedOps = {
				class: $("#class_id").val().trim(),
				stream: $("#stream_id").val().trim(),
				term: $("#term_id").val().trim(),
				year: $("#year").val().trim()
			};

			this.thisClass = $("#class_id").val().trim();

			var selected = {};
			//populate with the actual models/objects
			selected.class = Classes.where({id: selectedOps.class})[0].toJSON();
			selected.stream = (Streams.where({id: selectedOps.stream})[0]) ? Streams.where({id: selectedOps.stream})[0].toJSON() : null;
			selected.subjects = this.getSubjects();
			selected.term = Terms.where({id: selectedOps.term})[0].toJSON();
			selected.year = selectedOps.year;

			//load the template into view
			this.$main.html(this.spreadsheetsTpl({
				selected: selected
			}));

			//this.$rowsTable = this.$("#rows-entries-list");

			//fetch the list of students with SpreadsheetsCol, if they already have
			SpreadsheetsCol.fetch({
				data: $.param({ 
					token: tokenString,
					class: selectedOps.class,
					stream: selectedOps.stream,
					term: selectedOps.term,
					year: selectedOps.year					
				}),
				reset: true
			});

			//fetch the list of students for this class/stream
			Students.fetch({
				data: $.param({ 
					token: tokenString,
					class: selectedOps.class,
					stream: selectedOps.stream				
				})
			});				
			
			//fetch the list of teachers for this class/stream
			Teachers.fetch({
				data: $.param({ 
					token: tokenString				
				})
			});				

		},

		getSubjects: function(){

			var regSubjects = [];
			var subjects = Subjects.where({
				class_id: this.thisClass
			});

			$.each(subjects, function(key, oneSubject){
				regSubjects.push(oneSubject.toJSON());
			});			

			return regSubjects;

		},

		getGrades: function(){

			var regGrades = [];
			Grades.each(function(grade){
				regGrades.push(grade.toJSON());
			}, this);			

			return regGrades;

		},

		getStudents: function(){

			var regStudents = [];
			Students.each(function(student){
				regStudents.push(student.toJSON());
			}, this);			

			return regStudents;

		},

		getTeachers: function(){

			var regTeachers = [];
			Teachers.each(function(teacher){
				regTeachers.push(teacher.toJSON());
			}, this);			

			return regTeachers;

		},

		addOneRow: function(Row, key){
			$('.no-students-yet').hide();
			//add the list of subject
			Row.set({subjects: this.getSubjects()});
			Row.set({grades: this.getGrades()});
			Row.set({position: (key + 1)});

			var view = new SpreadsheetView({
				model: Row 
			});		
			$("#rows-entries-list").append(view.render().el);
		},

		addAllRows: function(){
			$("#rows-entries-list").empty();

			if(SpreadsheetsCol.length == 0) {
				//there are not classes yet, show the no classes alert
				$('.no-students-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-students-yet').hide();
				SpreadsheetsCol.each(this.addOneRow, this);
			}

			//perform result analysis
			this.doAnalysis();
			
		},

		doAnalysis: function(){

			var analysis = {};
			analysis.totalScore = 0;
			analysis.meanScore = 0;
			analysis.meanGrade = 0;
			analysis.top5overall = [];
			analysis.top3perSubject = [];
			analysis.subjectPerformance = [];

			//collects the scores per subject together
			SpreadsheetsCol.each(function(rowEntry){
				
				analysis.totalScore += rowEntry.get("total");
				Subjects.each(function(subject){
					analysis.top3perSubject["ID" + subject.get('id')] = [];
					
					var exs = rowEntry.get('exams');
					$.each(exs, function(key, exam){

						if (exam.subject_id == subject.get('id')) {
							analysis.top3perSubject["ID" + subject.get('id')].push({
								exam_percent: exam.exam_percent, 
								student_id: exam.student_id
							});
						}
					});
				}, this);
					
			}, this);

			//compute the total scores for each subject
			Subjects.each(function(subject){
				var marks = analysis.top3perSubject["ID" + subject.get('id')];
				var subjectTotal = 0;
				$.each(marks, function(key, mark){
					subjectTotal += mark.exam_percent;
				});

				analysis.subjectPerformance.push({
					subject_id: subject.get('id'),
					subjectTotal: subjectTotal
				});
			}, this);


			//get the top 5 overall in ranking
			analysis.top5overall = SpreadsheetsCol.slice(0, 5);

			//get the mean score
			analysis.meanScore = Math.round(analysis.totalScore / SpreadsheetsCol.length);

			//get the mean grade
			Grades.each(function(grade){
				if ((analysis.meanScore >= grade.get('from_score')) && (analysis.meanScore <= grade.get('to_score')) ) {
					analysis.meanGrade = grade.get('letter_grade');
				}
			}, this);

			//get the top 3 per subject
			Subjects.each(function(subject){
				var marks = analysis.top3perSubject["ID" + subject.get('id')];
				marks = _.sortBy(marks, function(mark){ return -mark.exam_percent;});
				analysis.top3perSubject["ID" + subject.get('id')] = marks.slice(0,2);
			}, this);

			analysis.subjects = this.getSubjects();
			analysis.students = this.getStudents();
			analysis.teachers = this.getTeachers();

			//ranks the subjects by performance
			analysis.subjectPerformance = _.sortBy(analysis.subjectPerformance, function(subject){return -subject.subjectTotal;});

			$(".spreadsheet-analysis").html(this.spreadsheetsAnalysisTpl(analysis));
			
		}

	});

	return Spreadsheets;

});