const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.getPosts = (req, res) => {
    Post.find()
        .select('_id title body')
        .then(data => res.json({ data }))
        .catch(err => res.status(400).json({ message: err.message }))
}

exports.createPost = (req, res) => {
    const { title, body } = req.body
    const post = new Post({ title, body })
    post.save()
        .then(({ _id, title, body }) => res.json({ message: 'Registro correcto', data: { _id, title, body } } ))
        .catch(err => res.status(500).json({ message: err.message }))
}

exports.signup = async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(403).json({ message: 'Ese email ya está registrado' })
    }
    const user = await new User({ name, email, password })
    await user.save()
        .then(({ _id, name, email }) => res.json({ message: 'Usuario creado exitosamente', data: { _id, name, email } }))
        .catch(err => res.status(500).json({ message: 'No se pudo crear el usuario' }))
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }, (err, usuario) => {
        if (err || !usuario) return res.status(401).json({ message: err.message })
        if (!usuario.authenticate(password)) {
            return res.status(401).json({ message: 'Credenciales incorrectas' })
        }
        const token = jwt.sign({ _id: usuario._id }, process.env.SECRET_KEY)
        res.cookie('t', token, { expires: new Date(Date.now() + 10000) })
        const { _id, name, email } = usuario
        return res.json({ token, user: { _id, name, email } })
    })
}

exports.logout = async (req, res) => {
    res.clearCookie('t')
    return await res.json({ message: 'Sesión cerrada' })
}

exports.allUsers = (req, res) => {
    User.find(async (err, users) => {
        if (err) return await res.status(400).json({ message: err.message })
        // const _users = users.map(user => { 
        //     const { _id, name, email, created } = user
        //     return { _id, name, email, created }
        // })
        await res.json({ users })
    }).select('name email created updated')
}

exports.userProfile = async (req, res) => {
    const { _id, name, email } = req.profile
    return await res.json({ user: { _id, name, email } })
}

exports.errorHandler = (req, res) => {
    res.status(404).json({ message: `Error: ruta ${ req.originalUrl } no encontrada` })
}
