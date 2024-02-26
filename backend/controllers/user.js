/***********************************/
/*** Import des module nécessaires */
// const bcrypt = require('bcrypt')

const DB = require('../db.config')
const User = DB.User
const { RequestError, UserError } = require('../errors/customError')
/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = (req, res, next) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => next(err))
}

exports.getUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Missing parameter')
    }

    try{
        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: userId }, raw: true })

        //test si resultat
        if (user === null) {
            throw new UserError('This user does not exist !', 0)
        }

        //renvoi de l'utilisateur trouvé
        return res.json({ data: user })
    } catch (err) {
        next(err)
    }
      
}

exports.addUser = async (req, res) => {
    const { nom, prenom, pseudo, email, password } = req.body

    // Validation des données reçues
    if (!nom || !prenom || !pseudo || !email || !password) {
        throw new RequestError('Missing parameter')
    }

    try{
        // Vérification si l'utilisateur existe déjà
        const user = await User.findOne({ where: { email: email }, raw: true })
        if (user !== null) {
            throw new UserError(`The user ${nom} already exists !`, 1)
        }

        // Hashage du mot de passe utilisateur
        //let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        //req.body.password = hash

        // Céation de l'utilisateur
        let userc = await User.create(req.body)

        //réponse de l'utilisateur crée
        return res.json({ message: 'User Created', data: user })

    }catch (err) {
        next(err)
    }
}

exports.updateUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Missing parameter')
    }

    try{
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: {id: userId}, raw: true})
        if(user === null){
            throw new UserError('This user does not exist !', 0)
        }

        // Mise à jour de l'utilisateur
        await User.update(req.body, { where: {id: userId}})

        //reponse de l'utilisateur mise à jour
        return res.json({ message: 'User Updated' })
    } catch (err) {
        next(err)
    }
}

exports.untrashUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id);

        // Vérification si le champ id est présent et cohérent
        if (!userId || isNaN(userId)) {
            throw new RequestError('Missing or invalid parameter');
        }
        
        // Restauration de l'utilisateur
        await User.restore({ where: { id: userId } });

        // Réponse de l'utilisateur restauré avec un statut 204 (No Content)
        return res.status(204).json({});
    } catch (err) {
        // Passer l'erreur au middleware suivant pour la gestion des erreurs
        next(err);
    }
};

exports.trashUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id);

        // Vérification si le champ id est présent et cohérent
        if (!userId || isNaN(userId)) {
            throw new RequestError('Missing or invalid parameter');
        }

        // Suppression de l'utilisateur
        await User.destroy({ where: { id: userId } });

        // Réponse de la suppression de l'utilisateur avec un statut 204 (No Content)
        return res.status(204).json({});
    } catch (err) {
        // Passer l'erreur au middleware suivant pour la gestion des erreurs
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }

        // Suppression de l'utilisateur
        await User.destroy({ where: { id: userId }, force: true })
        
        // Réponse de la suppression
        return res.status(204).json({})            
    } catch (err) {
        next(err)
    }
}