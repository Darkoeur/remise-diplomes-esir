/**
 * Profil.js
 *
 * @description :: Representing all the modifiable data a user can have
 * 					Opposed to the informations given when creating the account
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
		},
		portrait: {
			type:'string',
			defaultsTo: 'unknown.png'
		}

	}
};

