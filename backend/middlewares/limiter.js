const rateLimit = require("express-rate-limit");

const signUpLimiter = rateLimit({
   windowMs: 10 * 60 * 1000, // 15 minutes
   max: 3, // limit each IP to 30 requests per windowMs
   message: "Veuillez réessayer plus tard",
});
const signInLimiter = rateLimit({
   windowMs: 60 * 1000, // 15 minutes
   max: 5, // limit each IP to 30 requests per windowMs
   message: "Veuillez réessayer plus tard",
});
const GlobalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Veuillez réessayer plus tard.",
      statusCode: 429, // HTTP status code for rate limit exceeded
      skipFailedRequests: true, // Skip counting failed requests (e.g., 4xx responses)
      skipSuccessfulRequests: false // Do not skip counting successful requests (e.g., 2xx responses)
   });

module.exports = {signUpLimiter, signInLimiter,GlobalLimiter};
