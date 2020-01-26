const Usuario = require('../models/user')
const jwt = require('jsonwebtoken')

exports.createPostValidator = (req, res, next) => {
    let errors = []
    const { title, body } = req.body
    if (body && typeof(body) === 'string') {
        if (body.length < 10 || body.length > 2000) {
            errors.push('El contenido debe tener entre 10 y 2000 caracteres')
        }
    } else if (body.length === 0 || body === '' || !body) {
        errors.push('Debe haber contenido')
    }
    if (title && typeof(title) === 'string') {
        if (title.length < 5 || title.length > 150) {
            errors.push('El título debe tener entre 5 y 150 caracteres')
        }
    } else if (title.length === 0 || title === ' ' || !title) {
        errors.push('Escribe un título')
    }
    if (errors[0]) {
        return res.status(400).json({ message: errors.join('. ') })
    }
    next()
}

exports.signupValidator = (req, res, next) => {
    let errors = []
    const { email, name, password } = req.body
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)) {
        errors.push('Email no válido')
    }
    if (name && typeof(name) === 'string' && name.length < 5 || name.length > 20) {
        errors.push('El nombre debe tener entre 5 y 20 caracteres')
    } else if (name.length === 0 || name === '' || !name) {
        errors.push('Debe haber un nombre')
    }
    if (password && typeof(password) === 'string' && password.length < 8) {
        errors.push('La contraseña debe tener 8 o más caracteres')
    } else if (password.length === 0 || password === '' || !password) {
        errors.push('Debe haber una contraseña')
    }
    if (!/\d/.test(password)) {
        errors.push('La contraseña debe tener al menos un número')
    }
    if (errors[0]) {
        return res.status(400).json({ message: errors.join('. ') })
    }
    next()
}

exports.requireCredentials = (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if (typeof(authorizationHeader) !== 'undefined') {
        const bearer = authorizationHeader.split(' ')
        const bearerToken = bearer[1]

        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, datos) => {
            if (err) return res.status(401).json({ message: 'Token inválido' })

            req.user = {}
            req.user['_id'] = datos

            Usuario.findById(req.user._id, (err, usuario) => {
                if (err) return res.status(500).json({ message: err.message })
                if (!usuario) return res.status(400).json({ message: 'Credenciales incorrectas' })
                if (usuario.password !== req.user.password) {
                    return res.status(401).json({ message: 'Credenciales incorrectas' })
                }
                req.user.email = usuario.email
                req.user.name = usuario.name
                next()
            })
        })
    } else {
        return res.status(401).json({ message: 'Acción no autorizada. Token inválido' })
    }
}

exports.userById = async (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err || !user) return res.status(400).json({ message: 'Usuario no encontrado' })
        req.profile = user
        next()
    })
}
