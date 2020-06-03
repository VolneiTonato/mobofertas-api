import EstabelecimentoSchema from '../schemas/estabelecimento.schema'
import MasterRepository from './masterRespository'

export default class EstabelecimentoRepository extends MasterRepository {

    constructor() {
        super(EstabelecimentoSchema)
    }

    async findOne(query, fields, options) {
        return super.oneDoc(await this.find(query, fields, options))

    }

    async save(param) {

        return new Promise(async (resolve, reject) => {

            try {
                resolve(await super.save(param))
            } catch (err) {
                reject(err)
            }
        })
    }


    async login({ email, cnpj }) {

        return new Promise((resolve, reject) => {

            this._model.findOne({ email, cnpj }).exec((err, doc) => {
                if (err)
                    return reject(err)
                return resolve(doc)

            })
        })
    }


    async find(param = {query, fields, options}) {



        param.fields = param?.fields || "-password -token"

        return await super.find(param.query, param.fields, {
            populate: [
                { path: 'categoria', select: "+descricao -_id -__v" },
                { path: 'endereco.municipio' }
            ], ...param.options
        })
    }

}