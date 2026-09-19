const { Router } = require('express')
const User = require('../../controllers/users')
const { chechJWT } = require('../../middlewares')
 
const router = Router()

router.post('/signup', User.createUser)
router.post('/login', User.login)
router.post('/job/create', chechJWT, User.createJob)
router.get('/jobs', chechJWT, User.getUserJobs)
router.delete('/job/id', chechJWT, User.deleteUsersJob)

module.exports = router