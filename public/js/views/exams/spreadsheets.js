define([
	'jquery',
	'underscore',
	'backbone',
	'views/exams/spreadsheet',
	'collections/users/spreadsheets',
	'collections/tmplt/classes',
	'collections/tmplt/streams',
	'collections/tmplt/subjects',
	'collections/tmplt/exams',
	'collections/users/terms',
	'text!templates/exams/choosesheet.html',
	'text!templates/exams/classes.html',
	'text!templates/exams/streams.html',
	'text!templates/exams/terms.html',
	'text!templates/exams/spreadsheets.html'
	], function($, _, Backbone, SpreadsheetView, SpreadsheetsCol, Classes, Streams, Subjects, Exams, Terms, chooseSheetTpl, classesTpl, streamsTpl, termsTpl, spreadsheetsTpl){

	var Spreadsheets = Backbone.View.extend({

		chooseSheetTpl: _.template(chooseSheetTpl),
		classesTpl: _.template(classesTpl),
		streamsTpl: _.template(streamsTpl),
		termsTpl: _.template(termsTpl),
		spreadsheetsTpl: _.template(spreadsheetsTpl),

		tagName: 'div',

		thisClass: '', //the class for getting the spreadsheet

		events: {
			'change #class_id' : 'getStreams',
			'submit form#getspreadsheet' : 'getSpreadsheet'
		},

		initialize: function(){
			
			this.$main = $(".container-fluid");
			this.listenTo(SpreadsheetsCol, 'reset', this.addAllRows);
			this.listenTo(Classes, 'reset', this.setClasses);
			this.listenTo(Terms, 'reset', this.getTerms);

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

		},		

		getTerms: function(){

			var regTerms = [];

			Terms.each(function(term){
				regTerms.push(term.toJSON());
			}, this);		

			this.$terms.html(this.termsTpl({
				regTerms: regTerms
			}));

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
			selected.stream = Streams.where({id: selectedOps.stream})[0].toJSON();
			selected.subjects = this.getSubjects();
			selected.term = selectedOps.term;
			selected.year = selectedOps.year;

			//load the template into view
			this.$main.html(this.spreadsheetsTpl({
				selected: selected
			}));

			this.$rowsTable = $("#rows-entries-list");

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
		addOneRow: function(Row){
			$('.no-students-yet').hide();
			//add the list of subject
			Row.set({subjects: this.getSubjects()})
			var view = new SpreadsheetView({
				model: Row 
			});			
			this.$rowsTable.append(view.render().el);
		},

		addAllRows: function(){
			this.$rowsTable.empty();

			if(SpreadsheetsCol.length == 0) {
				//there are not classes yet, show the no classes alert
				$('.no-students-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-students-yet').hide();
				SpreadsheetsCol.each(this.addOneRow, this);
			}
			
		}

	});

	return Spreadsheets;

});