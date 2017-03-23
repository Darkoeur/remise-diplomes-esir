/**
 * ProfilController
 *
 * @description :: Server-side logic for managing Profils which are an extension to the user data
 * 					only the modifiable data will be here
 */

module.exports = {
	
	// Action (GET) : send all the data of the user requesting it
	// Needed : an active session
	
	getInfo: function(req,res) {
		sails.log.debug('The user #' + req.session.user + ' wants to refresh his data');		
		
		if(!req.session.user) return res.json({success:false,message:'Votre session a expiré !'});
		
		// With the user id we can retrieve the profil
		
		User.findOne({id:req.session.user}).populate('profil').exec(function (err, user){
			if (err) return res.json({success:false,message:'ERREUR SERVEUR'});
	
			if (!user) return res.json({success:false,message:'Session expirée !'});

			var formattedUser = user.profil;
				formattedUser.nom = user.nom;
				formattedUser.prenom = user.prenom;
				formattedUser.specialite = user.specialite;		  
			  
			sails.log.debug('Here is the formatted data we send him :');
			sails.log.debug(formattedUser);
			  
			return res.json({success:true,data:formattedUser});
			
		});

	},
	
	// Action (POST) : modify one of the attribute
	// Needed : a JSON containing the attribute to modify and the new value to assign
	
	modify: function(req,res) {
		sails.log.debug('The user #' + req.session.user + ' wants to change his data');
		
		// 1°) Check conformity
		
		if(!req.session.profil) return res.json({success:false,message:'Votre session a expiré !'});
		
		if(_.isUndefined(req.body)) return res.json({success:false, message:'Impossible de faire la modification.'});

		// TODO : REAL verifications there
		
		// 2°) Updating the data
		Profil.update({id:req.session.profil},req.body).exec(function then(err, updated) {
			if(err) return res.json({success:false, message:'ERREUR SERVEUR'});
			
			sails.log.debug('The new profil of the user : ' + updated);
			
			return res.json({success:true,message:'Changement réussi !'});
			
		});
		
	},
	
	// Action (POST) : upload an image and associating it with the user
	// Needed : a binary image included in the request and a logged in user
	
	uploadPic: function(req,res) {
		
		
		// 1°) Check conformity
		
		if(!req.session.profil) return res.json({success:false,message:'Votre session a expiré !'});
		
		if(_.isUndefined(req.file('image'))) return res.json({success:false,message:'Impossible de trouver l\'image !'});
		
		var file = req.file('image');
		
		// 2°) Uploading and associating the file
		
		if (!req.file('image')._files[0]) {
			// No file there
			sails.log.warn('No file uploaded, server will probably crash..');
			req.file('image').upload({noop:true});
			return res.json({success:false,message:'Aucune image fournie en paramètre.'});
		} else {
			// Uploading a real file
			file.upload({
				maxBytes:25000000,
				dirname: require('path').resolve('.tmp/public/portraits'),
				saveAs: req.session.user + '.png'
			}, function uploaded(err, pic) {
				if(err) {
					sails.log.error(err);
					return res.json({success:false,message:'L\'upload a échoué.'});
				}
				
				if(pic.lentgh === 0) return res.json({success:false,message:'Aucune image fournie.'});
				
				sails.log.info('Uploaded a file in tmp/public/portraits with description ' + pic[0].fd);
				
				// We can now associate it with the user
				Profil.update(req.session.profil, {portrait:req.session.user + '.png'}).exec(function (err) {
					if(err) return res.json({success:false,message:'L\'association avec votre compte a échoué.'});
					return res.json({success:true,message:'Image enregistrée avec succès !'});
				}
					
			});
		}
	}
	
};

