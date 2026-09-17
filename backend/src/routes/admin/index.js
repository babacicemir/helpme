const { Router } = require('express')
const Admin = require('../../controllers/admin')

const router = Router()

router.get('/users', Admin.getAllUsers)

module.exports = router