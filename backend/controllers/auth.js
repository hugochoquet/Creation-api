/***********************************/
/*** Import des module nécessaires */
// const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
// const argon2 = require('argon2');
const DB = require("../db.config");
const User = DB.User;
const fs = require("fs"); 
const { AuthenticationError } = require('../errors/customError')

/**********************************/
/*** Routage de la ressource Auth */

exports.login = async (req, res) => {
   const { email, password } = req.body;

   // Validation des données reçues
   if (!email || !password) {
      throw new AuthenticationError('Bad email or password', 0)
   }

   try {
      // Vérification si l'utilisateur existe
      let user = await User.findOne({ where: { email: email }, raw: true });
      if (user === null) {
         throw new AuthenticationError('This account does not exists !', 1)
      }

      // Vérification du mot de passe
      //let test = await bcrypt.compare(password, user.password)
      let test = await User.checkPassword(password, user.password);
      if (!test) {
         throw new AuthenticationError('Wrong password', 2)
      }

      // Génération du token et envoi
      const secret = fs.readFileSync(__dirname + "/../../.sets/pv.pem");
      const token = jwt.sign(
         {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
         },
         secret,
         { expiresIn: process.env.JWT_DURING, algorithm: "RS256" }
      );

      return res.json({ access_token: token });
   } catch (err) {
      next(err)
  }
};
