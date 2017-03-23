/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	// Action (PUT) : log a user on the server side by assigning him a session cookie
	// Needed : the email and the code of an existing user
	
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
			
			sails.log.debug('A user has logged in with id :' + user.id + ' and profil id : ' + user.profil);
			
			req.session.user = user.id;
			req.session.profil = user.profil;
			return res.json({success:true, message:'Bienvenue ' + user.prenom + ' !', token: user.id});
			
		});
		
		
	},
	
	// Action (GET) : tell if a specified user is authenticated
	// Needed : an active session
	
	isAuthenticated: function(req,res) {
		sails.log.debug('A user wants to know his state with id : ' + req.session.user);
		
		if (!req.session.user) return res.json({success:false, message:'Vous n\'êtes pas connecté.'});
		return res.json({success:true,message:'Vous êtes connecté !',token:req.session.user});
	},
	
	// Action (GET) : delete the server-side session cookie of a user
	// Needed : an active session
	
	logout: function(req, res) {
		
		sails.log.debug('A user has logged out');
		
		if(!req.session.user) return res.json({success:false, message:'Vous n\'êtes pas connecté.'});
		
		User.findOne(req.session.user, function foundOne(err, user) {
			if (err) return res.json({success:false, message:'Impossible de trouver l\'utilisateur correspondant.'});
			if (!user) {
				sails.log.debug('Session refers to a no longer existant user');
			}
			
			req.session.user = null;
			req.session.profil = null;
			
			return res.json({success:true, message:'Déconnexion effectuée !'});
		});
	},
	
	// Action (POST) : adding a user in our database
	// Needed : informations about the user and a unique email
	
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

	},
	
	// Action (PUT) : get users matching the given informations
	// Needed : A string describing the users searched
	search: function(req,res) {
		sails.log.debug('Someone wants to find users');
		
		// 1°) Conformity check
		if(_.isUndefined(req.param('query'))) {
			return res.json({success:false,message:'Impossible de répondre à la requête !'});
		} 
		
		// No need to be connected
		// Parsing the query which should looks like : 'XXXX YYYYY'
		// Where XXXX may be the prenom and YYYYY the nom
		// Or the opposite
		
		var parsingRegex = /^([a-z]+) ([a-z]+)$/i;
		sails.log.debug('Regex details : ');
		sails.log.debug(parsingRegex.exec(req.param('query')));
		
		var firstGroup = parsingRegex.exec(req.param('query'))[1];
		var secondGroup = parsingRegex.exec(req.param('query'))[2];
		
		sails.log.debug('Here is the query formatted : (prenom:' + firstGroup + ')(nom:' + secondGroup + ')');
		
		// 2°) Returning the matches
		
		var correspondingRequest = {
			or: [
					{prenom: {'contains':firstGroup}},
					{nom: {'contains':secondGroup}},
					{prenom:{'contains':secondGroup}},
					{nom: {'contains':firstGroup}}
			]
		};
		
		User.find(correspondingRequest).populate('profil').exec(function(err,matches) {
			if(err) return res.json({success:false,message:'ERREUR SERVEUR'});
			if(!matches) return res.json({success:true,message:'Aucun utilisateur correspondant.',users:[]});
			
			sails.log.debug('Utilisateurs trouvés :');
			sails.log.debug(matches);
			
			return res.json({success:true,message:'Résultats :',users:matches});
		});
	}
};

