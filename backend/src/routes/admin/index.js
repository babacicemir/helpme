const { Router } = require('express')
const Admin = require('../../controllers/admin')

const router = Router()

router.get('/users', Admin.getAllUsers)
router.delete('/user/:id', Admin.deleteUser)
router.get('/jobs', Admin.getAllJobs)
router.delete('/job/:id', Admin.deleteJob)
router.get('/services', Admin.getAllServices)
router.delete('/service/:id', Admin.deleteService)
router.post('/category', Admin.addCategory)
router.delete('/category/:id', Admin.deleteCategory)
router.patch('/category/:id', Admin.updateCategory)
router.get('/reports', Admin.getAllReports)
router.patch('/users/block/:id', Admin.blockUser)
router.patch('/users/unblock/:id', Admin.unBlockUser)
router.get('/blocked_users', Admin.getBlockedUsers)

module.exports = router