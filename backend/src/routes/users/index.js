const { Router } = require('express')
const User = require('../../controllers/users')
const { checkJWT, checkAccess } = require('../../middlewares')
const validation = require('../../middlewares/validator')
 
const router = Router()

router.post('/signup', validation.validateCreateUser, User.createUser)
router.post('/login', validation.validateLogin, User.login)
router.post('/job/create', checkJWT, User.createJob)
router.get('/jobs', checkJWT, User.getUserJobs)
router.delete('/job/:id', checkJWT, User.deleteUsersJob)
router.get('/job/offers/:id', checkJWT, User.getAllOffers)
router.get('/user/offers', checkJWT, User.getUserOffers)
router.patch('/job/offer/accept/:id', checkJWT, User.acceptOffer)
router.patch('/job/offer/reject/:id', checkJWT, User.rejectOffer)
router.post('/job/:id/offer', checkJWT, User.sendOffer)
router.delete('/offer/:id', checkJWT, User.deleteOffer)
router.post('/job/:id/message', checkJWT, User.sendMessage)
router.patch('/message/:id', checkJWT, User.updateMessage)
router.delete('/message/:id', checkJWT, User.deleteMessage)
router.get('/job/:id/messages', checkJWT, User.getMessagesByJob)
router.post('/message/:id/reply', checkJWT, User.createReplyToMessage)
router.post('/user/:userId/review', checkJWT, User.createReview)
router.get('/user/reviews/received', checkJWT, User.getAllReceivedReviews)
router.get('/user/reviews/given', checkJWT, User.getAllGivenReviews)


module.exports = router