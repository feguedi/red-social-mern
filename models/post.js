const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Se requiere de un título'],
        minlength: 5,
        maxlength: 150
    },
    body: {
        type: String,
        required: [true, 'Se requiere del contenido'],
        minlength: 10,
        maxlength: 2000
    }
})

module.exports = model('Post', PostSchema)
