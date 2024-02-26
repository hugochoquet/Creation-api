/***********************************/
/*** Import des module nécessaires */
const jwt = require('jsonwebtoken')
const fs = require("fs");

/*************************/
/*** Extraction du token */
const extractBearer = authorization => {

    if(typeof authorization !== 'string'){
        return false
    }

    // On isole le token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]

}


/******************************************/
/*** Vérification de la présence du token */
const checkTokenMiddleware = (req, res, next) => {

    const token = req.headers.authorization && extractBearer(req.headers.authorization)

    if(!token){
        return res.status(401).json({ message: 'not good'})
    }

    // Vérifier la validité du token
    const secret = fs.readFileSync(__dirname + "/../../.sets/pb.pem");
    jwt.verify(token, secret, (err, decodedToken) => {
        if(err){
            return res.status(401).json({message: 'Bad token'})
        }

        next()
    })
}

module.exports = checkTokenMiddleware