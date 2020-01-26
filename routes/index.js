const router = require('express').Router()
const { getPosts, createPost, signup, login, logout, allUsers, userProfile, errorHandler } = require('../controllers')
const { createPostValidator, signupValidator, requireCredentials, userById } = require('../middleware')

router.get('/posts', requireCredentials, getPosts)
router.post('/post', [requireCredentials, createPostValidator], createPost)
router.post('/signup', signupValidator, signup)
router.post('/login', login)
router.get('/logout', requireCredentials, logout)
router.get('/user/:userId', requireCredentials, userProfile)
router.get('/users', requireCredentials, allUsers)

router.param('userId', userById)

router.get('*', errorHandler)

module.exports = router
