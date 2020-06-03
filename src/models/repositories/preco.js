import MasterRepository from './masterRespository'
import PrecoSchema from '../schemas/preco.schema'
import moment from 'moment'

export default class PrecoRepository extends MasterRepository {

    constructor() {
        super(PrecoSchema)
    }

    async saveByCupomNFCe(item, estabelecimentoId) {
        return new Promise(async (resolve, reject) => {
            try {
                let { ean, descricao, precoAtual, UN, dataValidade } = item

                let precoExists = super.oneDoc(await super.find({

                    $or: [
                        { descricao: descricao }
                    ]

                }))

                let data = { precoAtual, status: true, dataValidade }


                if (precoExists?._id) {
                    if (precoExists.ean.indexOf(ean) === -1)
                        data.ean = ean
                    await super.update({ _id: precoExists._id }, data)
                } else {

                    data.estabelecimento = estabelecimentoId
                    data.descricao = descricao
                    data.ean = ean

                    let schema = new PrecoSchema(data)

                    super.validate(schema)

                    await schema.save()
                }

                resolve(true)



            } catch (err) {
                reject(err)
            }


        })
    }


    async saveByImportacao(param, estabelecimentoId) {
        return new Promise(async (resolve, reject) => {
            try {

                let {
                    PRODUTO,
                    EAN,
                    PRECO,
                    PRECO_ANTERIOR,
                    IMAGEM,
                    STATUS,
                    DATA_FIM,
                } = param


                let precoExists = super.oneDoc(await super.find({

                    $or: [
                        { descricao: PRODUTO }, { ean: EAN }
                    ],
                    estabelecimento: estabelecimentoId

                }))


                let date = new Date(moment(new Date().setDate(new Date().getDate() + 2)))


                let data = {
                    precoAnterior: PRECO_ANTERIOR,
                    precoAtual: PRECO,
                    imagem: IMAGEM,
                    dataValidade: DATA_FIM && moment(new Date(DATA_FIM)).isValid() ? new Date(DATA_FIM) : date,
                    status: STATUS == 'ATIVO'
                }
                

                if (precoExists?._id) {
                    if (precoExists.ean.indexOf(EAN) === -1)
                        data.ean = EAN
                    await super.update({ _id: precoExists._id }, data)
                } else {

                    data.estabelecimento = estabelecimentoId
                    data.descricao = PRODUTO
                    data.ean = EAN

                    let schema = new PrecoSchema(data)


                    super.validate(schema)

                    await schema.save()
                }

                resolve(true)

            } catch (err) {
                reject(err)
            }
        })
    }


    async find(param = { query, fields, options }) {

        param.fields = param.fields || '-estabelecimento'

        return await super.find(param.query, param.fields, param.options)
    }

}
