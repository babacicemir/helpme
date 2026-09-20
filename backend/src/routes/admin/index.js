const { Router } = require('express')
const { checkJWT } = require('../../middlewares')
const Admin = require('../../controllers/admin')

const router = Router()

router.get('/users', checkJWT, Admin.getAllUsers)
router.delete('/user/:id', checkJWT, Admin.deleteUser)
router.get('/jobs', checkJWT, Admin.getAllJobs)
router.delete('/job/:id', checkJWT, Admin.deleteJob)
router.get('/services', checkJWT, Admin.getAllServices)
router.delete('/service/:id', checkJWT, Admin.deleteService)
router.post('/category', checkJWT, Admin.addCategory)
router.delete('/category/:id', checkJWT, Admin.deleteCategory)
router.patch('/category/:id', checkJWT, Admin.updateCategory)
router.get('/reports', checkJWT, Admin.getAllReports)
router.patch('/users/block/:id', checkJWT, Admin.blockUser)
router.patch('/users/unblock/:id', checkJWT, Admin.unBlockUser)
router.get('/blocked_users', checkJWT, Admin.getBlockedUsers)

module.exports = router