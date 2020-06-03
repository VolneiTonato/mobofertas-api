import Paginate from 'express-paginate'

module.exports = (app) => {
    app.use(Paginate.middleware(10, 50))

    require('./controllers/estabelecimento')(app)
    require('./controllers/categoria')(app)
    require('./controllers/preco')(app)
    require('./controllers/categoriaProduto')(app)
    require('./controllers/tabloides')(app)
    require('./controllers/municipioEstadao')(app)

    
}