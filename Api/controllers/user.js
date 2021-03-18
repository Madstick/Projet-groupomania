const conn = require('../sqlConfig')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/authconfig')

exports.signup = (req, res, next) => {
  const user = req.body
  bcrypt.hash(user.password, 10).then((hash) => {
    user.password = hash
    user.isAdmin = 0
    conn.query('INSERT INTO users SET ?', user, function (
      error,
      results,
      fields
    ) {
      if (error) {
        // Si erreur de la requête
        console.log(error) // La console du serveur affiche l'erreur
        return res.status(400).json(error.sqlMessage)
      } // Et retourne uniquement le message de l'erreur au front
      return res.status(201).json({
        message:
          'Votre compte a bien été créé ! Vous pouvez maintenant vous connecter.'
      })
    })
  })
}

exports.login = (req, res, next) => {
  const userReq = req.body.email
  const passReq = req.body.password
  if (userReq && passReq) {
    conn.query(
      'SELECT * FROM users WHERE email= ? AND enabled = 1',
      userReq,
      function (_error, results, _fields) {
        if (results && results.length > 0) {
          bcrypt.compare(passReq, results[0].password).then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: 'Utilisateur ou mot de passe inconnu' })
            } else {
              console.log(userReq, "s'est connecté")
              let privilege = ''
              if (results[0].isAdmin === 1) {
                privilege = 'admin'
              } else {
                privilege = 'member'
              }
              res.status(200).json({
                userId: results[0].idUSERS,
                username: results[0].username,
                email: results[0].email,
                privilege: privilege,
                token: jwt.sign(
                  { userId: results[0].idUSERS, role: privilege },
                  config.token,
                  { expiresIn: '24h' }
                )
              })
            }
          })
        } else {
          res
            .status(401)
            .json({ message: 'Utilisateur ou mot de passe inconnu' })
        }
      }
    )
  } else {
    res
      .status(500)
      .json({ message: "Entrez un nom d'utilisateur et un mot de passe" })
  }
}

// En cas de deconnexion de l'utilisateur pour faire une action
exports.logout = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, config.token)
  // decodedToken.exp
    res.status(200).json({ message : "Vous avez bien été déconnecté "})
}

exports.getAllUsers = (req, res, next) => {
  conn.query(
    'SELECT idUSERS, username, isAdmin, email, enabled FROM users',
    function (error, results, fields) {
      if (error) {
        return res.status(400).json(error)
      }
      return res.status(200).json({ results })
    }
  )
}

exports.getUser = (req, res, next) => {
  let userId;
  if (req.params.id){
    userId=req.params.id
  }
  else{
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.token)
    userId = decodedToken.userId
  }  
  conn.query(
    "SELECT u.idUSERS, u.username, u.isAdmin, u.email, COUNT(DISTINCT m.idMESSAGES) AS 'nombre_message', COUNT(DISTINCT l.idMESSAGES) AS 'nombre_likes' FROM users u LEFT JOIN messages m ON u.idUSERS = m.idUSERS AND m.message_parent IS NULL LEFT JOIN likes l ON u.idUSERS = l.idUSERS WHERE u.idUSERS= ?",
    userId,
    function (error, results, fields) {
      if (error) {
        return res.status(400).json(error)
      }
      if (results[0].idUSERS === null ){
        return res.status(404).json("Utilisateur introuvable")
      }
      return res.status(200).json({ user:results })
    }
  )
}

exports.getUserMessages = (req, res, next) => {
  conn.query(
    'SELECT * FROM messages WHERE idUSERS= ? AND message_parent IS NULL',
    req.params.id,
    function (error, results, fields) {
      if (error) {
        return res.status(400).json(error)
      }
      return res.status(200).json({ msg:results })
    }
  )
}

exports.getUserLikes = (req, res, next) => {
  conn.query(
    'SELECT l.*,m.title FROM likes l LEFT JOIN messages m ON l.idMESSAGES=m.idMESSAGES WHERE l.idUSERS= ?',
    req.params.id,
    function (error, results, fields) {
      if (error) {
        return res.status(400).json(error)
      }
      return res.status(200).json({ likes:results })
    }
  )
}

exports.disableUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, config.token)
  console.log(decodedToken.userId,req.params.id)
  if((decodedToken.role === 'admin' && decodedToken.userId !== parseInt(req.params.id) ) || decodedToken.userId === parseInt(req.params.id) ){
    conn.query(
      "UPDATE users SET enabled = 0 WHERE idUSERS=?",
      req.params.id,
      function (error, results, fields) {
        console.log(results)
        if (error) {
          return res.status(400).json(error)
        }
        if (decodedToken.userId === req.params.id){
        }        
        return res
          .status(200)
          .json({ message: 'Le compte a bien été supprimé !' })
      }
    )
  }
  // return res.status(401).json({ message: 'Supression non autorisée' })
}

exports.enableUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, config.token)
  if((decodedToken.role === 'admin' && decodedToken.userId !== req.params.id )){
    conn.query(
      "UPDATE users SET enabled = 1 WHERE idUSERS=?",
      req.params.id,
      function (error, results, fields) {
        if (error) {
          return res.status(400).json(error)
        }
        return res
          .status(200)
          .json({ message: 'Le compte a bien été restauré !' })
      }
    )
  }
  // return res.status(401).json({ message: 'Restauration non autorisée' })
}

exports.deleteUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, config.token)
  if((decodedToken.role === 'admin' && decodedToken.userId !== req.params.id )){
    conn.query(
      "DELETE FROM users WHERE idUSERS=?",
      req.params.id,
      function (error, results, fields) {
        if (error) {
          return res.status(400).json(error)
        }
        return res
          .status(200)
          .json({ message: 'Le compte a bien été supprimé définitivement!' })
      }
    )
  }
  // return res.status(401).json({ message: 'Supression non autorisée' })
}