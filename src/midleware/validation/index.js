import { validationResult, query, body } from 'express-validator'
import moment from 'moment'

export default validations => {
    return async (req, res, next) => {

        try {

            await Promise.all(validations.map(validation => validation.run(req)));

            const errors = validationResult(req)

            if (errors.isEmpty()) {
                return next();
            }



            let data = errors.array().map(({ msg, param }) => {
                return `${param} ${msg}`
            }).join(" - ")


            return res.status(400).send({ message: data })

        } catch (err) {
            return res.status(400).send({ message: err })
        }

    };
}


export const PageNumberValidation = query('page').isInt().customSanitizer(value => !isNaN(value) ? value : 1)

export const QuerySearchValidation = query('q').escape().customSanitizer(value => {
    try {
        return new RegExp(value, 'i')
    } catch (err) {
        throw new Error('Caracteres inválidos para consulta!')
    }
})

export const DataValidadeValidation = body('dataValidade').isISO8601().customSanitizer(value => {
    let dataAtual = moment(new Date(), 'YYYY-MM-DD')
    let dataValidade = moment(new Date(value), 'YYYY-MM-DD')

    let listTime = []

    listTime.push(dataValidade.diff(dataAtual, 'seconds'))
    listTime.push(dataValidade.diff(dataAtual, 'minutes'))
    listTime.push(dataValidade.diff(dataAtual, 'hours'))
    listTime.push(dataValidade.diff(dataAtual, 'days'))
    listTime.push(dataValidade.diff(dataAtual, 'years'))

    let data = listTime.filter(time => time < 0)

    if (data.length)
        throw new Error('Data de validade do Tablóide deve ser maior que a data atual')

    return value
})