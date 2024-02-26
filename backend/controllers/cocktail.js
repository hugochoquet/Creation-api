/***********************************/
/*** Import des module nécessaires */
const DB = require("../db.config");
const Cocktail = DB.Cocktail;
const User = DB.User;
const { RequestError, CocktailError } = require("../errors/customError");

/**************************************/
/*** Routage de la ressource Cocktail */

exports.getAllCocktails = (req, res) => {
   Cocktail.findAll({ paranoid: false })
      .then((cocktails) => res.json({ data: cocktails }))
      .catch((err) =>
         res.status(500).json({ message: "Database Error", error: err })
      );
};

exports.getCocktail = async (req, res) => {
   let cocktailId = parseInt(req.params.id);

   // Vérification si le champ id est présent et cohérent
   if (!cocktailId) {
      throw new RequestError("Missing parameter");
   }
   try {
      // Récupération du cocktail
      let cocktail = await Cocktail.findOne({
         where: { id: cocktailId },
         raw: true,
      });

      // Test si résultat
      if (cocktail === null) {
         throw new CocktailError("This cocktail does not exist !", 0);
      }

      // Renvoi du Cocktail trouvé
      return res.json({ data: cocktail });
   } catch (err) {
      return res.status(500).json({ message: "Database Error", error: err });
   }
};

exports.addCocktail = async (req, res) => {
   const { user_id, nom, description, recette } = req.body;

   // Validation des données reçues
   if (!user_id || !nom || !description || !recette) {
      throw new RequestError("Missing parameter");
   }

   try {
      // Vérification si le coktail existe
      let cocktail = await Cocktail.findOne({ where: { nom: nom }, raw: true });
      if (cocktail !== null) {
         throw new CocktailError(`The cocktail ${nom} already exists !`, 1);
      }

      // Céation du cocktail
      cocktail = await Cocktail.create(req.body);

      //réponse du cocktail crée
      return res.json({ message: "Cocktail Created", data: cocktail });
   } catch (err) {
      next(err);
   }
};

exports.updateCocktail = async (req, res) => {
   let cocktailId = parseInt(req.params.id);

   // Vérification si le champ id est présent et cohérent
   if (!cocktailId) {
      throw new RequestError("Missing parameter");
   }

   try {
      // Recherche du cocktail et vérification
      let cocktail = await Cocktail.findOne({
         where: { id: cocktailId },
         raw: true,
      });
      if (cocktail === null) {
         throw new CocktailError("This cocktail does not exist !", 0);
      }

      // Mise à jour du cocktail
      await Cocktail.update(req.body, { where: { id: cocktailId } });

      //réponse de la mise à jour
      return res.json({ message: "Cocktail Updated" });
   } catch (err) {
      next(err);
   }
};

exports.untrashCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id);

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId || isNaN(cocktailId)) {
            throw new RequestError('Missing or invalid parameter');
        }

        // Restaurer le cocktail depuis la corbeille
        await Cocktail.restore({ where: { id: cocktailId } });

        // Répondre avec un statut 204 (No Content)
        return res.status(204).json({});
    } catch (err) {
        // Passer l'erreur au middleware suivant pour la gestion des erreurs
        next(err);
    }
};

exports.trashCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id);

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId || isNaN(cocktailId)) {
            throw new RequestError('Missing or invalid parameter');
        }

        // Suppression du cocktail
        await Cocktail.destroy({ where: { id: cocktailId } });

        // Répondre avec un statut 204 (No Content)
        return res.status(204).json({});
    } catch (err) {
        // Passer l'erreur au middleware suivant pour la gestion des erreurs
        next(err);
    }
};


exports.deleteCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId) {
            throw new RequestError('Missing parameter')
        }

        // Suppression du cocktail
        await Cocktail.destroy({ where: { id: cocktailId }, force: true })

        // Réponse de la suppression
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}