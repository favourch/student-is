define([
	'jquery',
	'underscore',
	'backbone',
	'collections/users/terms',
	'views/settings/term',
	'text!templates/settings/terms.html',
	'bootstrap',
	'jqueryui'
	], function($, _, Backbone, TermsCol, TermView, termsTpl){

	var Terms = Backbone.View.extend({

		tagName: 'div',

		template: _.template(termsTpl),

		events: {
			'submit #add-new-term' : 'addTermPost'
		},

		initialize: function(){

			$(".container-fluid").append(this.$el.html(this.template()));
			//define the table reference to use for adding individual classes
			this.$termsList = this.$("#terms-table");
			
			this.listenTo(TermsCol, 'add', this.addOneTerm);
			this.listenTo(TermsCol, 'reset', this.addAllTerms);

			TermsCol.fetch({
				reset: true,
				data: $.param({ 
					token: tokenString
				})
			});	

		},

		addTermPost: function(evt){

			evt.preventDefault(); 
			var newTerm = {
				term_name: $("#new-term-name").val(),
				term_abbr: $("#new-term-abbr").val(),
				start_date: $("#new-term-start").val(),
				end_date: $("#new-term-end").val()
			};

			$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Saving...');
			$(".error-message").hide(200);
			$(".success-message").hide(200);

			TermsCol.create(newTerm, {
				url: baseURL + 'settings/terms?token=' + tokenString,
				success: function(){
					$(".success-message").html("Term added successfully!").show(400);
					$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');
					
					//empty the form
					$("#new-term-name").val('');
					$("#new-term-abbr").val('');
					$("#new-term-start").val('');
					$("#new-term-end").val('');

					//fade out the modal
					$("#add_new_term").modal("hide");
				},
				error : function(jqXHR, textStatus, errorThrown) {
				    
				    if(textStatus.status != 401 && textStatus.status != 403) {
				      					    	
						$(".error-message").html("Please check the errors below!").show(400);
						$(".submit-button").html('<i class="fa fa-fw fa-check"></i> Save');

				    }

				}
				
			});

		},

		addOneTerm: function(Term){
			//remove the message for no terms yet, since there is a term to add
			$('.no-terms-yet').hide();
			var view = new TermView({
				model: Term 
			});
			this.$termsList.append(view.render().el);
		},

		addAllTerms: function(){
			this.$termsList.empty();

			if(TermsCol.length === 0) {
				//there are not classes yet, show the no classes alert
				$('.no-classes-yet').show();
			}
			else {
			//remove the message for no classes yet, since there are classes to add
				$('.no-classes-yet').hide();
				TermsCol.each(this.addOneTerm, this);
			}
			
		}

	});

	return Terms;

});