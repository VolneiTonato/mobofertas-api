import { WriteFileAndTransformImageWebHelper } from '../../helpers/transform-imagem-webp'
import { join } from 'path'
import axios from 'axios'
import Repository from '../../models/repositories/estabelecimento'

export default class EstabelecimentoMapsService {

    static async buildLogo(estabelecimento) {
        return new Promise(async (resolve, reject) => {

            try {
                let srcImage = join(`${__dirname}/../../public/images/estabelecimentos/logo`)

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