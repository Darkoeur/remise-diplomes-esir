/**
 * Profil.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	migrate: 'drop',

	attributes: {
		color: {
			type:'string',
			defaultsTo : 'black'
		},
		birthday: {
			type:'string',
			defaultsTo : '01/01/2000'
		},
		description: {
			type:'string',
			defaultsTo : ''
		}

	}
};

