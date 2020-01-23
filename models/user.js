const { Schema, model } = require('mongoose')
const uuid = require('uuid/v1')
const { createHmac } = require('crypto')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    hashed_password: {
        type: String,
        required: true,
        trim: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
})

UserSchema.virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = uuid()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })

UserSchema.methods = {
    authenticate(password) {
        return this.encryptPassword(password) === this.hashed_password
    },
    encryptPassword(password) {
        if (!password) return ''
        try {
            return createHmac('sha256', this.salt)
                .update(password)
                .digest('hex')
        } catch (error) {
            return ''            
        }
    }
}

module.exports = model('User', UserSchema)
