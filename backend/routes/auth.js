/***********************************/
/*** Import des module nécessaires */
const express = require("express");
const authCtrl = require("../controllers/auth");

const {signUpLimiter, signInLimiter,GlobalLimiter} = require("../middlewares/limiter");
/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router();

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use((req, res, next) => {
   const event = new Date();
   console.log("AUTH Time:", event.toString());
   next();
});
router.use(GlobalLimiter);

/**********************************/
/*** Routage de la ressource Auth */

router.post("/login", authCtrl.login);

module.exports = router;
