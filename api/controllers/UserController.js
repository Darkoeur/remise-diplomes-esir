/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	authenticate: function(req, res) {
		// 1°) existence of the two needed components email | code
		if (_.isUndefined(req.param('email'))) {
			return res.json({success:false, message:'L\'email est requis pour pouvoir se connecter.'});
		}
		if (_.isUndefined(req.param('code'))) {
			return res.json({success:false, message:'Le code est requis pour pouvoir se connecter.'})
		}
		
		// 2°) check conformity of params here (to be done)
		
		User.findOne({email: req.param('email')}, function foundOne(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.json({success:false, message:'Adresse email inconnue'});
				
			// Verifying password
			if (user.code !== req.param('code')) {
				return res.json({success:false, message:'Code invalide !'});
			}
			
			sails.log.debug('A user has logged in with id :' + user.id);
			
			req.session.user = user.id;
			
			return res.json({success:true, message:'Bienvenue ' + user.prenom + ' !', token: user.id});
			
		});
		
		
	},
	
	isAuthenticated: function(req,res) {
		sails.log.debug('A user wants to know his state with id : ' + req.session.user);
		
		if (!req.session.user) return res.json({success:false, message:'Vous n\'êtes pas connecté.'});
		return res.json({success:true,message:'Vous êtes connecté !',token:req.session.user});
	},
	
	logout: function(req, res) {
		
		sails.log.debug('A user has logged out');
		
		if(!req.session.user) return res.json({success:false, message:'Vous n\'êtes pas connecté.'});
		
		User.findOne(req.session.user, function foundOne(err, user) {
			if (err) return res.json({success:false, message:'Impossible de trouver l\'utilisateur correspondant.'});
			if (!user) {
				sails.log.debug('Session refers to a no longer existant user');
			}
			
			req.session.user = null;
			
			return res.json({success:true, message:'Déconnexion effectuée !'});
		});
	},
	
	// The function trying to register a user
	register: function(req, res) {
		
		sails.log.debug('Someone wants to become a user');
		
		// 1°) check existence of the params
		// nom | prenom | email | code | specialite
		if (_.isUndefined(req.param('nom'))) {
			return res.json({success:false, message:'Le nom est requis.'});
		}
		
		if (_.isUndefined(req.param('prenom'))) {
			return res.json({success:false, message:'Le prenom est requis.'});
		}
		
		if (_.isUndefined(req.param('email'))) {
			return res.json({success:false, message:'L\'email est requis.'});
		}
		
		if (_.isUndefined(req.param('code'))) {
			return res.json({success:false, message:'Le code est requis.'});
		}
		
		if (_.isUndefined(req.param('specialite'))) {
			return res.json({success:false, message:'La spécialité est requise.'});
		}
		
		// 2°) Now we can examine if the params are valid
		// TODO : To be able to fast start the project, this step is omitted
		// Only during development phase
		// TODO : encrypt password with a machinepack
		
		// 3°) Finally creating a profil and a user with that profil	

		Profil.create({}).exec(function(err,nouveauProfil) {
			if (err) return res.json({success:false,message:'ERREUR SERVEUR'});
			
			sails.log.debug('Creating a new user...');
			
			var options = {
				nom: req.param('nom'),
				prenom: req.param('prenom'),
				code: req.param('code'),
				specialite: req.param('specialite'),
				email: req.param('email'),
				profil: nouveauProfil.id
			};

			User.create(options).exec(function(err, user) {
				if (err) {
					sails.log.debug(err.Errors);
					var msg = '';
					// We iterate over all the errors raised, to build a message
					for (var errorThrown in err.Errors){
						msg += err.Errors[errorThrown][0].message + '<br/>';
					}
					
					return res.json({success:false, message:msg});
				} else {
					return res.json({success:true, message:'Inscription réussie, ' + options.prenom + ' ' + options.nom + ' !'});
				}
			});
			
		});

	}
};

