const express = require('express')
const auth = require('../controllers/auth')

const router = express.Router()

// Auth
router.post('/register', auth.register)
router.post('/account', auth.getAllUsers)

module.exports = router