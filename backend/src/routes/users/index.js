const { Router } = require('express')
const User = require('../../controllers/users')

const router = Router()

router.post('/signup', User.createUser)

module.exports = router