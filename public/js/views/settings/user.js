define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/settings/user.html'
	], function($, _, Backbone, userTpl){

	var User = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(userTpl),

		events: {
			'click .editUser' : 'editUser',
			'click .editDone' : 'editDone',
			'click .deleteUser' : 'deleteUser'
		},

		initialize: function(){
			//re-render on change event, remove from DOM on destroy event
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			
			//get the handles for the input fields 
			this.$fnameLabel = this.$(".fname");
			this.$lnameLabel = this.$(".lname");
			this.$emailLabel = this.$(".email");

			this.$fnameInput = this.$(".fname-input");
			this.$lnameInput = this.$(".lname-input");
			this.$emailInput = this.$(".email-input");

			this.$editUser = this.$(".editUser");
			this.$editDone = this.$(".editDone");

			return this;		
		},

		editUser: function(){
			//toggle visibility 
			this.$fnameLabel.addClass("hidden");
			this.$lnameLabel.addClass("hidden");
			this.$emailLabel.addClass("hidden");

			this.$fnameInput.removeClass("hidden");
			this.$lnameInput.removeClass("hidden");
			this.$emailInput.removeClass("hidden");

			this.$fnameInput.focus();
			this.$editUser.addClass("hidden");
			this.$editDone.removeClass("hidden");
		},

		editDone: function(){
			//toggle visibility 
			this.$fnameLabel.removeClass("hidden");
			this.$lnameLabel.removeClass("hidden");
			this.$emailLabel.removeClass("hidden");
			
			this.$fnameInput.addClass("hidden");
			this.$lnameInput.addClass("hidden");
			this.$emailInput.addClass("hidden");

			this.$editUser.removeClass("hidden");
			this.$editDone.addClass("hidden");

			//check the new values
			var fname = this.$fnameInput.val().trim();
			var lname = this.$lnameInput.val().trim();
			var email = this.$emailInput.val().trim();

			//ensure a name and abbreviation are provided
			if (fname && lname && email) {
				this.model.save({
					first_name: fname,
					last_name: lname,
					email: email
				},{
					url: baseURL + 'settings/users/' + this.model.get('id') + '?token=' + tokenString,
				});

				this.model.trigger('change');
			} 
					
		},
		deleteUser: function(){
			this.model.destroy({
				data: $.param({ 
					token: tokenString
				})
			});		
		}

	});

	return User;

});