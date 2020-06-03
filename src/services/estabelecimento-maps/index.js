import HereMapHelper from '../../helpers/heremaps'
import EstabelecimentoRepository from '../../models/repositories/estabelecimento'
import { WriteFileAndTransformImageWebHelper } from '../../helpers/transform-imagem-webp'
import { join } from 'path'

export default class EstabelecimentoMapsService {


    static async buildEnderecoStringByMaps(estabelecimento) {

        return new Promise(async (resolve, reject) => {


            try {
                let end = estabelecimento.endereco

                let stringPesquEndereco = `${end.logradouro},${end.numero},${end.bairro},${end.municipio?.descricao},${end.municipio?.estado?.descricao}`

                let data = await HereMapHelper.searchGeocode(stringPesquEndereco)

                if (data?.items?.length > 0) {

                    let item = data.items[0]

                    let { lat, lng } = item.position

                    let imagem = await HereMapHelper.imageCreate({
                        h: 800, w: 800,
                        poix: { lng: lng, lat: lat, description: estabelecimento.nome }
                    })


                    let srcImage = join(`${__dirname}/../../public/images/estabelecimentos/mapa`)


                    await WriteFileAndTransformImageWebHelper({
                        content: imagem,
                        ext: 'png',
                        fileName: estabelecimento._id,
                        isDeleteFileOld: true,
                        pathImg: srcImage
                    }).catch(err => reject(err))


                    end.lat = lat
                    end.lng = lng

                    end.linkMaps = HereMapHelper.createLinkPesquisa({ lat, lng })

                    end.imagem = `/estabelecimentos/mapa/${estabelecimento._id}.webp`

                    await new EstabelecimentoRepository().update(
                        { _id: estabelecimento._id },
                        { endereco: end }
                    )


                    resolve(true)



                    //let encode = Buffer.from(imagem, 'utf8').toString('base64')



                    //end.imagem = `data:image/jpeg;base64,${encode.toString()}`

                } else {
                    resolve(true)
                }

            } catch (err) {
                reject(err)
            }

        })
    }
}