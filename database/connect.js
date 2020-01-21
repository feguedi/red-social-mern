const mongoose = require('mongoose')
const prodBdUri = `mongodb+srv://${ process.env.BD_USER }:${ process.env.BD_PASS }@${ process.env.BD_HOST }/${ process.env.BD_NAME }`
const devBdUri = `mongodb://${ process.env.BD_HOST }:${ process.env.BD_PORT }/${ process.env.BD_NAME }`
let bdUri = ''

switch (process.env.NODE_ENV) {
    case 'development':
    case 'dev':
    case 'desarrollo':
        bdUri = devBdUri
        break;
    case 'production':
        bdUri = prodBdUri
    default:
        break;
}

mongoose.connect(bdUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('BD conectada'))
mongoose.connection.on('error', err => console.error(`Error con BD: ${ err.message }`))