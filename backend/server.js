/************************************/
/*** Import des modules nécessaires */
const express = require('express')
const cors = require('cors')
const checkTokenMiddleware = require('./middlewares/check')
const helmet = require('helmet')
const {signUpLimiter, signInLimiter,GlobalLimiter} = require("./middlewares/limiter");
/************************************/
/*** Import de la connexion à la DB */
let DB = require('./db.config')

/*****************************/
/*** Initialisation de l'API */
const app = express()

// Configuration Helmet
app.use(helmet({
    // Content Security Policy (CSP) pour contrôler les sources de contenu
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Autoriser le chargement depuis le même domaine
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"] // Autoriser le chargement de scripts depuis le même domaine et de Cloudflare CDN
            // Vous pouvez ajouter d'autres directives CSP selon vos besoins
        }
    },

    // Cross-Origin Resource Policy (CORP) pour contrôler les ressources cross-origin
    crossOriginResourcePolicy: { policy: "cross-origin" },

    // Expect-CT pour activer le rapport d'adhésion à la transparence du certificat (CT)
    expectCt: {
        enforce: true, // Forcer le navigateur à appliquer la politique Expect-CT
        maxAge: 30, // Durée de validité du rapport d'adhésion en secondes
        reportUri: 'https://example.com/report-ct' // URI de rapport pour les adhésions non conformes
    },

    // Referrer-Policy pour contrôler la manière dont les informations de référence sont incluses dans les requêtes HTTP
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    // Strict-Transport-Security pour forcer l'utilisation de HTTPS
    strictTransportSecurity: {
        maxAge: 31536000, // 1 an en secondes
        includeSubDomains: true, // Inclure les sous-domaines
        preload: true // Autoriser le préchargement HSTS dans les listes de préchargement des navigateurs
    }
}));
// curl http://localhost:4000 --include

app.use(cors({
   origin: "*",
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
   allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/***********************************/
/*** Import des modules de routage */
const user_router = require('./routes/users')
const cocktail_router = require('./routes/cocktails')

const auth_router = require('./routes/auth')

/******************************/
/*** Mise en place du routage */
app.use(GlobalLimiter)
app.get('/', (req, res) => res.send(`I'm online. All is OK !`))

app.use('/users',checkTokenMiddleware, user_router)
app.use('/cocktails', cocktail_router)

app.use('/auth', auth_router)

app.get('*', (req, res) => res.status(501).send('What the hell are you doing !?!'))


/********************************/
/*** Start serveur avec test DB */
DB.sequelize.authenticate()
    .then(() => console.log('Database connection OK'))
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`This server is running on port ${process.env.SERVER_PORT}. Have fun !`)
        })
    })
    .catch(err => console.log('Database Error', err))