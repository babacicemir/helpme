const { Router } = require('express')
const { checkJWT, checkAccess } = require('../../middlewares')
const Admin = require('../../controllers/admin')

const router = Router()

router.get('/users', checkJWT, checkAccess('ADMIN'), Admin.getAllUsers)
router.delete('/user/:id', checkJWT, checkAccess('ADMIN'), Admin.deleteUser)
router.get('/jobs', checkJWT, checkAccess('ADMIN'), Admin.getAllJobs)
router.delete('/job/:id', checkJWT, checkAccess('ADMIN'), Admin.deleteJob)
router.get('/services', checkJWT, checkAccess('ADMIN'), Admin.getAllServices)
router.delete('/service/:id', checkJWT, checkAccess('ADMIN'), Admin.deleteService)
router.get('/categories', checkJWT, checkAccess('ADMIN'), Admin.getAllCategories)
router.post('/category', checkJWT, checkAccess('ADMIN'), Admin.addCategory)
router.delete('/category/:id', checkJWT, checkAccess('ADMIN'), Admin.deleteCategory)
router.patch('/category/:id', checkJWT, checkAccess('ADMIN'), Admin.updateCategory)
router.get('/reports', checkJWT, checkAccess('ADMIN'), Admin.getAllReports)
router.patch('/users/block/:id', checkJWT, checkAccess('ADMIN'), Admin.blockUser)
router.patch('/users/unblock/:id', checkJWT, checkAccess('ADMIN'), Admin.unBlockUser)
router.get('/blocked_users', checkJWT, checkAccess('ADMIN'), Admin.getBlockedUsers)
router.get('/stats', checkJWT, checkAccess('ADMIN'), Admin.getDashboardStats)
router.get('/activity', checkJWT, checkAccess('ADMIN'), Admin.getRecentActivity)

module.exports = router