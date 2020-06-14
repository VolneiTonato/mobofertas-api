import './src/config/env'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import compress from 'compression'
import helmet from 'helmet'
import { createLogger } from 'bunyan'
import limitRate from './src/midleware/limiter-access'
import './src/database/mongodb-provider'
import { toString } from 'lodash'
import {Emitter, initialize} from './src/helpers/listener'

const app = express()

const log = createLogger({ name: 'api' })



app.use(compress())
app.use(helmet())

app.set('trust proxy', '1')

app.disable('x-powered-by')

app.use(limitRate)

app.use(cors())

app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }))
app.use(cookieParser())

initialize('app-api')

require('./src/api/router')(app)


app.use((err, req, res, next) => {

  let status = err?.status || 500

  let  message = err?.message

  if(message)
      message = message ? toString(message) : toString(err)

  Emitter.emit('critical', err)

  if(!message)
      return res.status(status).send()


  if (/(MongoError: E11000 duplicate key error collection)/ig.test(message))
      message = 'Este item já foi cadastradado!'

  return res.status(status).send({ status, message })
})


const server = app.listen(process.env.PORT)




server.on('listening', () => {
  log.info(`Server api on`)
})

server.on('error', (err) => {
  log.info(`Server api error ${String(err)}`)
})


