const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/', auth, userCtrl.getAllUsers)
router.get('/current', auth, userCtrl.getUser)
router.get('/:id', auth, userCtrl.getUser)
router.get('/:id/messages', auth, userCtrl.getUserMessages)
router.get('/:id/likes', auth, userCtrl.getUserLikes)
router.post('/:id/enable', auth, userCtrl.enableUser)
router.post('/:id/disable', auth, userCtrl.disableUser)
router.delete('/:id', auth, userCtrl.deleteUser)

module.exports = router