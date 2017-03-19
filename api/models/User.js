/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	
	migrate: 'drop',
	autoCreatedAt: true,
	autoUpdatedAt: false,

	attributes: {
		nom: {
			type: 'string',
			required: true
		},
		prenom: {
			type: 'string',
			required: true
		},
		email: {
			type: 'string',
			required: true,
			unique: true
		},
		specialite: {
			type: 'string',
			required: true
		},
		code: {
			type: 'string',
			required: true
		},
		// Here we'll use one-to-many associations
		// In order to keep the data synced, we have to modify
		// On the 'via' attribute, from the collection and not from there
		profil: {
			model: 'profil',
			unique: true
		},
		commentairesRecus: {
			collection: 'comment',
			via: 'receveur'
		},
		commentairesDonnes: {
			collection: 'comment',
			via: 'auteur'
		}
	 },
	 
	 validationMessages: {
		 email: {
			 required: 'Email requis.',
			 unique: 'Adresse email déjà enregistrée.'
		 },
		 nom: {
			 required: 'Nom requis.'
		 },
		 prenom: {
			 required: 'Prenom requis.'
		 },
		 code: {
			 required: 'Code requis.'
		 },
		 specialite: {
			 required: 'Spécialité requise.'
		 }
	 }
};

