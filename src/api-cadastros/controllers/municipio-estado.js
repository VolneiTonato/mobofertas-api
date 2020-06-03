import express from 'express'
import paginate from '../../midleware/paginator'
import MunicipioEstadoRepository from '../../models/repositories/municipioEstadoRepository'
import MunicipioEstadoIBGEService from '../../services/municipio-estado-ibg'

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


router.get('/atualizar-database-to-ibge', async (req, res, next) => {

    try {
        return res.status(400).send({ message: 'inactive' })
        MunicipioEstadoIBGEService()
            .then(ok => {

            }).catch(err => {
                res.send(err.toString())
            })

        res.send({ message: 'Municipios importados com sucesso!' })

    } catch (err) {
        next({ status: 401, message: err })
    }
})


module.exports = (app) => {
    app.use('/api-cadastro/municipios-estado', router)
}