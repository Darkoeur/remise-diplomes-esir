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
		
		if(!req.session.user) return res.json({success:false,message:'Cela requiert d\'être connecté !'});
		
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

	}
	
	// Action (POST) : modify one of the attribute
	// Needed : a JSON containing the attribute to modify and the new value to assign
	
	
};

