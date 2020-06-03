import { Router } from 'express'
import ServiceMaps from '../../services/estabelecimento-maps'
import paginate from '../../midleware/paginator'
import EstabelecimentoRepository from '../../models/repositories/estabelecimento'
import ServiceImages from '../../services/estabelecimento-imagens'


const router = Router()


router.get('/list', async (req, res, next) => {

    try {

        const [response, count] = await new EstabelecimentoRepository().find({}, {

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





router.post('/save', async (req, res, next) => {
    try {

        let repository = new EstabelecimentoRepository()

        const newEstabelecimento = await repository.save(req.body)

        const estabelecimento = await repository.findOne({ _id: newEstabelecimento._id })

        Promise.all([
            ServiceMaps.buildEnderecoStringByMaps(estabelecimento),
            ServiceImages.buildLogo(estabelecimento)
        ]).then(ok => {
            req.app.emit('emit-console', 'cadastro de imagens realizado com sucesso!')
        }).catch(err => {
            req.app.emit('emit-constole', err.toString())
        })

        return res.send({
            message: 'Estabelecimento cadastrado com sucesso!',
            data: newEstabelecimento
        })
    } catch (err) {
        next({status: 401, message: err})
    }


})



router.get('/atualizar-imagens/:id', async (req, res, next) => {

    try {
        
        let estabelecimento = await new EstabelecimentoRepository().findOne({ _id: req.params.id })

        await ServiceMaps.buildEnderecoStringByMaps(estabelecimento)
        

        res.send('Atualização de imagens com sucesso!')
    } catch (err) {
        next({status: 401, message: err})
    }
})


module.exports = (app) => {
    app.use('/api-cadastro/estabelecimentos', router)
}