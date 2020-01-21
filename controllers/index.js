const Post = require('../models/post')

exports.getPosts = (req, res) => {
    Post.find((err, docs) => {
        if (err) return res.status(400).json({ message: err.message })
        res.json({ data: docs })
    })
}

exports.createPost = (req, res) => {
    const { title, body } = req.body
    const post = new Post({ title, body })
    post.save()
        .then(({ _id, title, body }) => res.json({ message: `Registro correcto`, data: { _id, title, body } } ))
        .catch(err => res.status(500).json({ message: err.message }))
}

exports.errorHandler = (req, res) => {
    res.status(404).json({ message: `Error: ruta ${ req.originalUrl } no encontrada` })
}
