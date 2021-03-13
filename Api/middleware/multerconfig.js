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
})
const fileFilter = function(req, file, cb){
  const extension = MIME_TYPES[file.mimetype];
  console.log(extension)
  if (!extension) {
    cb(new Error('Seul des fichiers images sont autorisés')) 
  }
  cb(null, true);
}
const limits = {
  fileSize : 4194304
}

module.exports = multer({ storage,fileFilter,limits }).single('attachment')
