/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

	// DO NOT THE REMOVE THE CALLBACKS cb()
	
	sails.log.debug('STARTING THE SERVER');
	sails.log.debug(sails.config.appUrl);
	
	Profil.create({}).exec(function(err,profil) {
		
		if(err) cb();
		if(!profil) cb();
		
		var me = {
			prenom: 'Antoine',
			nom: 'GAUTRAIN',
			specialite: 'Boss du système',
			email: 'abc@gmail.com',
			code: 'abc',
			profil: profil.id
		};
		
		User.create(me).exec(function(err,usr) {
			if(err) cb();
			if(!usr) cb();
			
			cb();
		});
	});
	
};
