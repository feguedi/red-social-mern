const Express = require('express')
const app = Express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config({ silent: true })
require('./database/connect')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/', require('./routes'))

app.listen(process.env.PORT, () => console.log('Puerto 8008'))
