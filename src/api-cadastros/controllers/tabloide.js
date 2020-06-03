import { Router } from 'express'
import TabloideRepository from '../../models/repositories/tabloide'
import EstabelecimentoRepository from '../../models/repositories/estabelecimento'
import { multerConfigTabloide, multerPathsDest } from '../../config/multer'
import multer from 'multer'
import { body, validationResult, matchedData } from 'express-validator'
import ValidationMidleware from '../../midleware/validation'
import fs from 'fs'
import paginate from '../../midleware/paginator'
import { join } from 'path'

const router = Router()

const realPathImage = join(__dirname, '..', '..', '..', 'public', 'images', 'estabelecimentos', 'tabloides')


router.post('/import-tabloid', multer(multerConfigTabloide).single('file'), (req, res, next) => {

    if (req.file) {

        let { filename } = req.file

        fs.copyFile(`${multerPathsDest.destTabloides}/${filename}`, `${realPathImage}/${filename}`, (err) => {
            if (err)
                return next({ message: `O arquivo ${filename} é inválido!` })

            fs.unlink(`${multerPathsDest.destTabloides}/${filename}`, async (err) => {

                try {


                    let doc = await new TabloideRepository().save({
                        imagem: {
                            name: filename,
                            src: `${process.env.LINK_IMAGENS_ESTABELECIMENTO}/tabloides`
                        },
                        estabelecimento: req.user.id,
                        step: 1
                    })

                    res.send({ file: doc._id })
                } catch (err) {
                    next(err)
                }
            })
        })
    } else {
        next(`Erro ao enviar a imagem para o servidor`)
    }
}, (err, req, res, next) => {
    next({ status: 401, message: err })
})



router.post('/save', ValidationMidleware([
    body('dataValidade').isISO8601().notEmpty(),
    body('id').notEmpty()
]), async (req, res, next) => {

    try {

        let { dataValidade, id } = req.body

        await new TabloideRepository().update({
            _id: id
        }, {
            dataValidade,
            step: 2
        })

        res.send({ message: `Tabloíde cadastrado com sucesso` })


    } catch (err) {
        next({ status: 401, message: err })
    }
})

router.delete('/remove', ValidationMidleware([
    body('id').notEmpty()
]), async (req, res, next) => {


    try {
        const { id } = req.body

        const model = new TabloideRepository()

        let doc = model.oneDoc(await model.find({ query: { _id: id } }))

        if (!doc?._id)
            throw new Error('Tabloide inválido!')


        fs.unlink(`${realPathImage}/${doc.imagem.name}`, async (err) => {
            await new TabloideRepository().deleteOne({ _id: id })

            res.status(202).send()
        })

    } catch (err) {
        next({ status: 401, message: err })
    }

})


router.get('/list', async (req, res, next) => {

    try {

        const [response, count] = await new TabloideRepository().find({
            query: { estabelecimento: req.user.id }, options: {
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


router.put('/save', ValidationMidleware([
    body('id').isString().notEmpty().withMessage('Id Obrigatório!'),
    body('params').notEmpty().withMessage('Nenhum parametro para alteração!')
]), async (req, res, next) => {
    try {
        const setters = req.body.params

        await new TabloideRepository().update({ _id: req.body.id }, setters)

        return res.status(202).send()
    } catch (err) {
        next({ status: 401, message: err })
    }
})


router.post('/save', async (req, res, next) => {
    try {

        await new TabloideRepository().save(req.body)

        return res.status(201).send()
    } catch (err) {
        next({ status: 401, message: err })
    }


})


module.exports = (app) => {
    app.use('/api-cadastro/tabloides', router)
}