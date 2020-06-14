import express from 'express'
import paginate from '../../midleware/paginator'
import EstabelecimentoRepository from '../../models/repositories/estabelecimento'
import ValidationMidleware, {QuerySearchValidation, PageNumberValidation} from '../../midleware/validation'
import {query} from 'express-validator'

const router = express.Router()


router.get('/list', ValidationMidleware([
    PageNumberValidation,
    QuerySearchValidation,
    query('categories').escape()
]), async (req, res, next) => {

    try {

        let {q, categories} = req.query
        let select = {nome : q}

        if(categories)
            select.categoria = {$in: categories.split(',')}


        const [response, count] = await new EstabelecimentoRepository().find({

            query: select
            , options: {
                limit: req.query.limit,
                skip: req.skip,
                paginator: true
            }
        })


        const pageCount = paginate.calculate(count, req.query.limit)

        res.send({ response, page: req.query.page, pageNext: paginate.hasNextPages(req)(pageCount) })
    } catch (err) {
        next({ status: 401, message: err.toString() })
    }
})



module.exports = (app) => {
    app.use('/api/estabelecimentos', router)
}