import express from 'express'

import CategoriaRepository from '../../models/repositories/categoria'

const router = express.Router()

router.get('/list', async (req, res, next) => {
    new CategoriaRepository().find()
    .then(result => { res.status(200).send({data : result}).end() })
    .catch(err => next({status: 401, message: err}))
})

router.post('/save', async (req, res) => {
    try {
        const newCategoria = await new CategoriaRepository().save(req.body)

        return res.send({
            message: 'Categoria cadastrada com sucesso!',
            data: newCategoria
        })
    } catch (err) {
        next({status: 401, message: err})
    }


})


module.exports = (app) => {
    app.use('/api-cadastros/categorias', router)
}