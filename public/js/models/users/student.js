define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var Student = Backbone.Model.extend({

		defaults: {
			first_name: '',
			middle_name: '',
			last_name: '',
			dob: '',
			pob: '',
			bcn: '',
			sex: '',
			nationality: '',
			doa: '',
			clas: '',
			address: '',
			code: '',
			town: '',
			pg_f_name: '',
			pg_l_name: '',
			pg_email: '',
			pg_phone: ''
		}

	});

	return Student;

});