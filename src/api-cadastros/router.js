import jwt from 'jsonwebtoken'
import Paginate from 'express-paginate'

module.exports = (app) => {

  app.use((req, res, next) => {
    try {

      const authHeader = req.headers['authorization']
      
      const token = authHeader && authHeader.replace('Bearer ', '')

      if (token === null) return next({status: 401})

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        
        
        if (err) return next({status: 403})

        req.user = user

        next()
      })


    } catch (err) {
      next({status: 403})
    }
  })


  app.use(Paginate.middleware(10, 50))
  require('./controllers/estabelecimento')(app)
  require('./controllers/categoria-produto')(app)
  require('./controllers/preco')(app)
  require('./controllers/tabloide')(app)
  require('./controllers/cupom-nfce')(app)

}