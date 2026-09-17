const { Router } = require('express')
const Admin = require('../../controllers/admin')

const router = Router()

router.get('/users', Admin.getAllUsers)
router.delete('/user/:id', Admin.deleteUser)
router.get('/jobs', Admin.getAllJobs)

module.exports = router