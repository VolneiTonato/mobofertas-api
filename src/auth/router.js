const jwt = require('jsonwebtoken')

module.exports = (app) => {    
    require('./login-estabelecimento-react')(app)
}