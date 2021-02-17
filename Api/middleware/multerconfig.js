const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => { // On va renommer le fichier
    console.log(file)
    const name = file.originalname.split(' ').join('_'); // On élimine les espaces du nom d'origine, remplacés par "_"
    callback(null, Date.now() + name ) // création du nom final

  },
  fileFilter: (req, file, cb) => {
    const extension = MIME_TYPES[file.mimetype];
    console.log(extension)
    if (!extension) {
      return new Error('Seul des fichiers images sont autorisés')
    }
    cb(null, true);
  }
})

// TODO Faire gaffe au "name" des champs fichiers
module.exports = multer({ storage }).single('attachment')
// TODO Voir comment gérer plusieurs input file "name"
// module.exports = multer({ storage }).single('profile')
