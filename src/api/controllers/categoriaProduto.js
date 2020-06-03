import express from 'express'

import CategoriaProdutoRepository from '../../models/repositories/categoriaProduto'

const router = express.Router()

router.get('/list', (req, res, next) => {

    new CategoriaProdutoRepository().find()
    .then(result => { res.status(200).send({data : result}).end() })
    .catch(err => next({status: 401, message: err}))
})


module.exports = (app) => {
    app.use('/api/categorias-produtos', router)
}