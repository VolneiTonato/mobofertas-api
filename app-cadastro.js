import './src/config/env'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import compress from 'compression'
import helmet from 'helmet'
import { createLogger } from 'bunyan'
import limitRate from './src/midleware/limiter-access'
import methodOverride from 'method-override'
import './src/database/mongodb-provider'
import { toString } from 'lodash'
import {Emitter, initialize} from './src/helpers/listener'

const app = express()

const LoggerApp = createLogger({ name: 'apiCadastro' })

initialize('app-cadastro')


app.use(compress())
app.use(helmet())

app.use(methodOverride())

app.set('trust proxy', '1')

app.disable('x-powered-by')

app.use(limitRate)

app.use(cors({ credentials: true, origin: true }))

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())



require('./src/api-cadastros/router')(app)

app.use((err, req, res, next) => {

    let status = err?.status || 500

    let message = err?.message

    if(message)
        message = message ? toString(message) : toString(err)

    Emitter.emit('critical', err)

    if(!err?.message)
        return res.status(status).send()


    if (/(MongoError: E11000 duplicate key error collection)/ig.test(message))
        message = 'Este item já foi cadastradado!'

    return res.status(status).send({ status, message })
})

const server = app.listen(process.env.PORT_CADASTRO)

server.on('listening', () => {
    LoggerApp.info(`Server apiCadastro on`)
})

server.on('error', (err) => {
    LoggerApp.info(`Server apiCadastro error`)
})