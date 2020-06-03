import './src/config/env'
const express = require('express')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const serverStatic = require('serve-static')
const path = require('path')

const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(helmet())
app.use(compress())

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: false }))
app.use(cookieParser())

app.use((req, res, next) => {
    req.url = req.url.replace(/\/$/ig, '')
    next()
})

app.use('/imagens', serverStatic(path.join(__dirname, 'public/images'), {
    index:false,
    dotfiles:"deny"
}))

app.listen(process.env.PORT_STATIC)