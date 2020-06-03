import { WriteFileAndTransformImageWebHelper } from '../../helpers/transform-imagem-webp'
import { join } from 'path'
import axios from 'axios'
import PrecoRepository from '../../models/repositories/preco'

export default class ProdutoImagemService {

    static async buildImage(produto) {
        return new Promise(async (resolve, reject) => {

            try {
                let srcImage = join(`${__dirname}/../../public/images/produtos/`)

                let { data } = await axios.get(estabelecimento.avatar, { responseType: "arraybuffer" })

                await WriteFileAndTransformImageWebHelper({
                    content: data,
                    ext: 'png',
                    fileName: estabelecimento._id,
                    pathImg: srcImage,
                    isDeleteFileOld: true
                })

                await new Repository().update({ _id: estabelecimento._id }, { avatar: `estabelecimentos/logo/${estabelecimento._id}.webp` })

                resolve(true)

            } catch (err) {
                reject(err)
            }
        })
    }

}