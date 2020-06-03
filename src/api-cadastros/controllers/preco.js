import { Router } from 'express'
import { Types } from 'mongoose'
import PrecoRepository from '../../models/repositories/preco'
import PromiseHelper from '../../helpers/promise-helper'
import multer from 'multer'
import { multerConfigProdutos } from '../../config/multer'
import paginate from '../../midleware/paginator'
import ValidationMidleware, {PageNumberValidation, QuerySearchValidation} from '../../midleware/validation'
import {Emitter} from '../../helpers/listener'

const router = Router()


router.get('/list', ValidationMidleware([
    PageNumberValidation, QuerySearchValidation
]), async (req, res, next) => {
    try {

        const {q}  = req.query

        const query = {
            estabelecimento: Types.ObjectId(req.user.id)
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
        next({ status: 401, message: err })
    }

})


router.post('/import-planilha', multer(multerConfigProdutos).single('file'), (req, res, next) => {

    if (req.file) {

        new Promise(async (resolve, reject) => {

            try {

                const { produtos } = req.file

                const idLoja = req.user.id

                const produtosComErro = new Array()

                

                if (Array.isArray(produtos)) {
                    for (let produto of produtos) {
                        try {

                            console.log('chegou aqui')

                            
                            
                            await new PrecoRepository().saveByImportacao(produto, idLoja)

                            PromiseHelper.sleep(100)

                        } catch (err) {
                            produtosComErro.push({ produto, err })
                        }
                    }

                    resolve(true)
                } else {
                    reject('Nenhum produto para importação!')
                }

                if(produtosComErro)
                    Emitter.emit('error', `Produtos que não foram importado ${req.user._id}`, produto)

            } catch (err) {
                reject(err)
            }

        }).then(ok => {
            Emitter.emit('info', 'Produtos importados')
        }).catch(err => {
            Emitter.emit('critical', `import-planilha ${req.user._id}`, err)
        })


        return res.status(200).send()
    } else {
        next('Erro ao enviar arquivo para o servidor!')
    }

}, (err, req, res, next) => {
    next({status: 400, message: err})
})


module.exports = (app) => {
    app.use('/api-cadastro/precos-produto', router)
}