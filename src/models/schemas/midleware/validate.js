import moment from 'moment'

export function validateDataValidade(Schema, field = 'dataValidade') {

    try {

        Schema.path(field).validate(function (value) {

            if (this?.getUpdate()) {

                let { dataValidade, step } = this.getUpdate().$set

                if (step > 1) {

                    let dataAtual = moment(new Date(), 'YYYY-MM-DD')
                    dataValidade = moment(new Date(dataValidade), 'YYYY-MM-DD')

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
                }

            } else {
                return value
            }

        })
    } catch (err) {
        return true
    }


}