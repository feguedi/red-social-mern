const router = require('express').Router()
const { getPosts, createPost, errorHandler } = require('../controllers')
const { createPostValidator } = require('../middleware')

router.get('/posts', getPosts)
router.post('/post', createPostValidator, createPost)
router.get('*', errorHandler)

module.exports = router
