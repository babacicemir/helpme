const { Router } = require('express')
const User = require('../../controllers/users')
const { chechJWT } = require('../../middlewares')
 
const router = Router()

router.post('/signup', User.createUser)
router.post('/login', User.login)
router.post('/job/create', chechJWT, User.createJob)
router.get('/jobs', chechJWT, User.getUserJobs)
router.delete('/job/:id', chechJWT, User.deleteUsersJob)
router.get('/job/offers/:id', chechJWT, User.getAllOffers)
router.patch('/job/offer/accept/:id', chechJWT, User.acceptOffer)
router.patch('/job/offer/reject/:id', chechJWT, User.rejectOffer)
router.delete('/offer/:id', chechJWT, User.deleteOffer)
router.post('/job/:id/message', chechJWT, User.sendMessage)
router.patch('/message/:id', chechJWT, User.updateMessage)
router.delete('/message/:id', chechJWT, User.deleteMessage)
router.get('/job/:id/messages', chechJWT, User.getMessagesByJob)
router.post('/message/:id/reply', chechJWT, User.createReplyToMessage)

module.exports = router