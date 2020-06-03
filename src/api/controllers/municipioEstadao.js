import express from 'express'
import paginate from '../../midleware/paginator'
import MunicipioEstadoRepository from '../../models/repositories/municipioEstadoRepository'

const router = express.Router()

router.get('/list', async (req, res, next) => {

    try {

        const [response, count] = await new MunicipioEstadoRepository().find({ param: { codigo: 4302105 } }, {

            limit: req.query.limit,
            skip: req.skip,
            paginator: true

        })

        const pageCount = paginate.calculate(count, req.query.limit)

        res.send({ response, page: req.query.page, pageNext: paginate.hasNextPages(req)(pageCount) })

    } catch (err) {
        next({ status: 401, message: err })
    }
})


module.exports = (app) => {
    app.use('/api/municipios-estado', router)
}