import express from 'express'

import CategoriaProdutoRepository from '../../models/repositories/categoriaProduto'

const router = express.Router()


router.post('/save', async (req, res, next) => {
    try {
        const newCategoria = await new CategoriaProdutoRepository().save(req.body)

        return res.send({
            message: 'Categoria cadastrada com sucesso!',
            data: newCategoria
        })
    } catch (err) {
        next({status: 401, message: err})
    }


})


module.exports = (app) => {
    app.use('/api-cadastro/categorias-produtos', router)
}