import ProdutoSchema from '../schemas/produto.schema'
import MasterRepository from './masterRespository'

export default class ProdutoRepository extends MasterRepository {

    constructor() {
        super(ProdutoSchema)
    }

    async saveProdutoByPreco({ descricao, ean, imagem }) {
        return new Promise(async (resolve, reject) => {
            try {

                let produto = new ProdutoSchema()

                let produtoExists = super.oneDoc(await super.find({param: {descricao: `${descricao}` }}))

                let id = null

                if (produtoExists?._id) {

                    let dataAltered = {}

                    id = produtoExists._id

                    if (ean && !produtoExists.ean)
                        dataAltered.ean = ean

                    if (imagem && !produtoExists.imagem)
                        dataAltered.imagem = imagem


                    if (Object.getOwnPropertyNames(dataAltered).length)
                        await super.update({ _id: id }, dataAltered)

                } else {
                    produto.descricao = descricao
                    produto.ean = ean
                    produto.imagem = imagem

                    this.validate(produto)

                    id = (await produto.save())._id
                }

                resolve(id)

            } catch (err) {
                reject(err)
            }

        })
    }

    async find(query, fields, options = {}) {
        fields = fields || '-estabelecimentoId'
        return await super.find(query, '-estabelecimentoId', {populate: { path: 'categorias', select: '-_id +descricaoo' }, ...options })
    }

}