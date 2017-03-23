/**
 * CommentController
 *
 * @description :: Server-side logic for managing the Comments posted by the users
 */

module.exports = {
	
	// Action (POST) : add a comment to the database
	// Needed : An active session (the author) and the target user (the receiver)
	addOne: function(req, res) {
		
		// 1°) Conformity check
		
		if(!req.session.user) return res.json({success:false, message:'Votre session a expiré !'});
		
		if(_.isUndefined(req.param('message'))) {
			return res.json({success:false, message:'Impossible de trouver le contenu du message.'});
		}
		
		if(_.isUndefined(req.param('receveur'))) {
			return res.json({success:false, message:'Impossible de trouver le destinataire.'});
		}
		
		// TODO: regex on the params
		
		// 2°) Insertion
		User.find({id:req.param('receveur')}, function foundOne(err, usr) {
			
			if(err) return res.json({success:false, message:'ERREUR SERVEUR'});
			
			if(!usr) return res.json({success:false, message:'Ce profil n\'existe pas ou plus.'});
			
			// Building the message (date is handled on the database side)
			var options = {
				receveur: req.param('receveur'),
				auteur: req.session.user,
				contenu: req.param('message')
			};
			
			Comment.create(options).exec(function inserted(err, comment) {
				if(err) return res.json({success:false, message:'L\'envoi du commentaire a échoué.'});
				
				return res.json({success:true,message:'Commentaire ajouté avec succès !'});
			});
			
		});
		
	},
	
	// Action (DELETE) : remove a comment
	// Needed : The id of a comment and an active session referring to the author of the comment
	deleteOne: function(req,res) {
		
		// 1°) Conformity check
		
		if(!req.session.user) return res.json({success:false,message:'Votre session a expiré !'});
		
		if(_.isUndefined(req.param('commentID'))) {
			return res.json({success:false, message:'Impossible de trouver le commentaire à supprimer !'});
		}

		// 2°) Authorization check
		
		Comment.findOne(req.param('commentID'), function foundOne(err,commentaire) {
			if(err) return res.json({success:false,message:'ERREUR SERVEUR'});
			
			if(!commentaire) return res.json({success:false, message:'Ce commentaire n\'existe pas ou plus.'});
			
			// The current user is the author of the comment
			if(commentaire.auteur != req.session.user) return res.json({success:false,message:'Vous devez être l\'auteur du commentaire supprimé.'});
		
			Comment.destroy({id:req.param('commentID')}).exec(function del(err) {
				sails.log.debug('A comment has been deleted !');
				if(err) res.json({success:false,message:'ERREUR SERVEUR'});
				return res.json({success:true,message:'Commentaire supprimé !'});
			});
		
		});
		
	} 
	
	
};

