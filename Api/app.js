require('dotenv').config()
const express = require('express')
const path = require ('path') // Pour le middleware express static qui permet d'acceder au chemin du système de fichier
const cors = require ('cors')

const messageRoutes = require('./routes/message')
const userRoutes = require('./routes/user')
const homeRoutes = require('./routes/home')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

var allowedOrigins = ['http://localhost:3000',
                      'http://localhost:8000'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));  

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); 

app.use('/images',express.static('images'))

app.use('/api/messages', messageRoutes)
app.use('/api/auth', userRoutes)
app.use('/', homeRoutes)

module.exports = app