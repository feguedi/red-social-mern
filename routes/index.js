const router = require('express').Router()
const { getPosts, createPost, signup, login, errorHandler } = require('../controllers')
const { createPostValidator, signupValidator } = require('../middleware')

router.get('/posts', getPosts)
router.post('/post', createPostValidator, createPost)
router.post('/signup', signupValidator, signup)
router.post('/login', login)
router.get('*', errorHandler)

module.exports = router
