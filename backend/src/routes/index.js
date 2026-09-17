const { Router } = require('express')
const userRouter = require('../routes/users')
const adminRouter = require('../routes/admin')


const router = Router()

router.use('/helpme.ba', userRouter)
router.use('/helpme.ba/admin', adminRouter)

module.exports = router