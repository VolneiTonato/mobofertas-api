import express from 'express'
import TabloideRepository from '../../models/repositories/tabloide'
import EstabelecimentoRepository from '../../models/repositories/estabelecimento'
import paginate from '../../midleware/paginator'
import ValidationMidleware, {PageNumberValidation, QuerySearchValidation} from '../../midleware/validation'
import {param} from 'express-validator'
import {Types} from 'mongoose'


const router = express.Router()



router.get('/list/:owner', ValidationMidleware([
    param('owner').customSanitizer(value => { return Types.ObjectId(value) }),
]), async (req, res, next) => {
    try {

        const { owner } = req.params

        const [response, count] = await new TabloideRepository().find({
            query: {
                estabelecimento: owner,
                dataValidade: { "$gte": new Date() },
                status: true
            }, options: {

                limit: req.query.limit,
                skip: req.skip,
                paginator: true
            }

        })

        const pageCount = paginate.calculate(count, req.query.limit)

        res.send({ response, count, page: req.query.page, pageNext: paginate.hasNextPages(req)(pageCount) })


    } catch (err) {
        next({ status: 401, message: err })
    }
})

router.get('/list', async (req, res, next) => {

    try {

        let tabloides = await new TabloideRepository().find()

        if (tabloides) {
            let estabelecimento = await new EstabelecimentoRepository().find({ query: { _id: tabloides[0]?.estabelecimento } })
            if (!estabelecimento)
                throw `Estabelecimento inválido!`
        } else {
            throw `Nenhum produto encontrado!`
        }

        return res.status(200).send({
            data: tabloides
        })

    } catch (err) {
        next({ status: 401, message: err })
    }

})


module.exports = (app) => {
    app.use('/api/tabloides', router)
}