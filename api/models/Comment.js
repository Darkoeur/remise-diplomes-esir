/**
 * Comment.js
 *
 * @description :: Representation on the database of the Comments
					Defined by the sender, the receiver and the content
 */

module.exports = {
	migrate:'drop',
	autoUpdatedAt: true,
	autoCreatedAt: true,
	attributes: {
		receveur: {
			model:'user',
			required: true
		},
		auteur: {
			model:'user',
			required: true
		},
		contenu: {
			type: 'string',
			required: true
		}
	}
};

