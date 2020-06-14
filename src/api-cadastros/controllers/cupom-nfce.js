import { Router } from 'express'
import ValidationMidleware, {DataValidadeValidation} from '../../midleware/validation'
import { body } from 'express-validator'
import CupomNFCERepository from '../../models/repositories/cupomNFCe'
import CupomNFCEService from '../../services/cupom-nfc-sefaz'

const router = Router()


router.post('/save', ValidationMidleware([
    DataValidadeValidation,
    body('linkNfce').isURL({ require_host: 'sefaz.rs.gov.br' }).notEmpty().trim()
]), async (req, res, next) => {
    try {

        let { linkNfce, dataValidade } = req.body

        linkNfce = linkNfce.replace('https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?', 'https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?')

        await new CupomNFCERepository().save({
            estabelecimento: req.user.id,
            link: linkNfce
        })

        await new CupomNFCEService(linkNfce, req.user.id, dataValidade)
            .then(ok => req.app.emit('emit', 'NF importada com sucesso!'))
            .catch(err => req.app.emit('emit', err))


        res.status(201).send()

    } catch (err) {
        next({message: err, status: 401})
    }

})


module.exports = (app) => {
    app.use('/api-cadastro/cupom-nfce', router)
}