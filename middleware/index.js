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
