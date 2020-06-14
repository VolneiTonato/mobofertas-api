import { Router } from 'express'
import PrecoRepository from '../../models/repositories/preco'
import paginate from '../../midleware/paginator'
import ValidationMidleware, {PageNumberValidation, QuerySearchValidation} from '../../midleware/validation'
import { param } from 'express-validator'
import { Types } from 'mongoose'

const router = Router()


router.get('/list/:owner', ValidationMidleware([
    param('owner').customSanitizer(value => { return Types.ObjectId(value) }),
    PageNumberValidation, QuerySearchValidation
]), async (req, res, next) => {
    try {

        const { owner } = req.params

        const {q}  = req.query

        const query = {
            estabelecimento: owner
        }

        

        if(q)
            query.descricao = q

        const [response, count] = await new PrecoRepository().find({
            query: query, options: {

                limit: req.query.limit,
                skip: req.skip,
                paginator: true,


            }
        })

        const pageCount = paginate.calculate(count, req.query.limit)

        res.send({ response, count, page: req.query.page, pageNext: paginate.hasNextPages(req)(pageCount) })

    } catch (err) {
        next({ status: 400, message: err })
    }

})


module.exports = (app) => {
    app.use('/api/produtos', router)
}