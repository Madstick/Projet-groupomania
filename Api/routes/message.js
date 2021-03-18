const express = require('express')
const router = express.Router()

const messageCtrl = require('../controllers/message')
const auth = require('../middleware/auth')
const multer = require('../middleware/multerconfig')

router.post('/', auth, multer, messageCtrl.createMessage)
router.get('/', auth, messageCtrl.getAllMessages)
router.get('/:id', auth, messageCtrl.getMessage)
router.put('/:id', auth, multer, messageCtrl.modifyMessage)
router.delete('/:id', auth, messageCtrl.deleteMessage)
router.get('/comments/:id', auth, messageCtrl.getComment)
router.post('/like/:id', auth, messageCtrl.addLike)
router.delete('/like/:id', auth, messageCtrl.removeLike)

module.exports = router