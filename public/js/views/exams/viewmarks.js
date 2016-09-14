define([
	'jquery',
	'underscore',
	'backbone',
	'views/exams/viewmark',
	'collections/tmplt/classes',
	'collections/tmplt/streams',
	'collections/tmplt/subjects',
	'collections/tmplt/exams',
	'collections/tmplt/marklists',
	'collections/users/terms',
	'text!templates/exams/choosesubject.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/subjects.html',
	'text!templates/exams/exams.html',
	'text!templates/exams/terms.html',
	'text!templates/exams/viewmarks.html'
	], function($, _, Backbone, viewMark, Classes, Streams, Subjects, Exams, Marklist, Terms, chooseSubject, classesTpl, streamsTpl, subjectsTpl, examsTpl, termsTpl, entriesTpl){

	var marksView = Backbone.View.extend({

		chooseSubject: _.template(chooseSubject),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		subjectsTpl: _.template(subjectsTpl),
		examsTpl: _.template(examsTpl),
		termsTpl: _.template(termsTpl),
		entriesTpl: _.template(entriesTpl),

		tagName: 'div',

		events: {
			'change #class_id' : 'getStreams',
			'submit form#viewmarks' : 'viewMarks'
		},

		initialize: function(){
			
			this.$main = $(".container-fluid");
			this.listenTo(Marklist, 'reset', this.addAllStudents);

			//fetch list of all streams for this client from the database
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
			this.$el.html(this.chooseSubject());
			this.$classes = this.$("#classes-list");
			this.$streams = this.$("#streams-list");
			this.$subjects = this.$("#subjects-list");
			this.$terms = this.$("#terms-list");
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

			this.getTerms();
	
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
			this.getSubjects();

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
		
		getTerms: function(){

			var regTerms = [];

			Terms.each(function(oneExam){
				regTerms.push(oneExam.toJSON());
			}, this);			

			this.$terms.html(this.termsTpl({
				regTerms: regTerms
			}));

			return this;

		},

		viewMarks: function(evt){

			//prevent default form submission
			evt.preventDefault();

			//get the selected values
			var selectedOps = {
				class: $("#class_id").val(),
				stream: $("#stream_id").val(),
				subject: $("#subject_id").val(),
				term: $("#term_id").val(),
				year: $("#year").val()
			};
			var selected = {};
			//populate with the actual models/objects
			selected.class = Classes.where({id: selectedOps.class})[0].toJSON();
			selected.stream = (Streams.where({id: selectedOps.stream})[0]) ? Streams.where({id: selectedOps.stream})[0].toJSON() : null;
			selected.subject = Subjects.where({id: selectedOps.subject})[0].toJSON();
			selected.term = selectedOps.term;
			selected.year = selectedOps.year;
			selected.exams = [];

			//get the registered exams for this class
			var exs = Exams.where({
				class_id: $("#class_id").val()
			});
			$.each(exs, function(key, ex){
				selected.exams.push(ex.toJSON());
			})

			//load the template into view
			this.$main.html(this.entriesTpl({
				selected: selected
			}));

			/*
			 this handler is NOT accessible - I dont know why
			 */
			this.$marksList = $("#marks-entries-list");

			//fetch the list of students with marks, if they already have
			Marklist.fetch({
				data: $.param({ 
					token: tokenString,
					class: selectedOps.class,
					stream: selectedOps.stream,
					subject: selectedOps.subject,
					term: selectedOps.term,
					year: selectedOps.year					
				}),
				reset: true
			});				

		},

		addOneStudent: function(mark){
			$('.no-students-yet').hide();
			var view = new viewMark({
				model: mark
			});		
			this.$marksList.append(view.render().el);
		},

		addAllStudents: function(){

			this.$marksList.empty();
			if(Marklist.length == 0) {
				//there are not classes yet, show the no classes alert
				$('.no-students-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-students-yet').hide();
				Marklist.each(this.addOneStudent, this);
			}
		
		}

	});

	return marksView;

});