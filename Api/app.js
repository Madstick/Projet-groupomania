require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser') // Pour faciliter le traitement des données contenues dans le corp de la reqûete, le transformant en objet JSON
const path = require ('path') // Pour le middleware express static qui permet d'acceder au chemin du système de fichier

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

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); 

app.use('/images',express.static('images'))

app.use('/api/messages', messageRoutes)
app.use('/api/auth', userRoutes)
app.use('/', homeRoutes)

module.exports = app