class UserError extends Error {
   constructor(errorMessage) {
      super();
      this.name = "UserError [tu es null]";
      this.statusCode = 400;
      this.message = `Le nouveau message d'erreur ${errorMessage}`;
   }
}

module.exports = UserError;