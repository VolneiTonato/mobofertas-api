import mbxClient from '@mapbox/mapbox-sdk'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'
const token = process.env.MAP_BOX_KEY

const baseClient = mbxClient({ accessToken: token })
const geocoding = mbxGeocoding(baseClient)


export default class MapBoxHelper {

    static async forwardGeocode(address) {
        //'rua herminio gabbardo, 120, são vendelino, bento gonçalves, rio grande do sul',

        return new Promise((resolve, reject) => {


            geocoding.forwardGeocode({
                query: address,
                autocomplete: false,
                countries: ['br'],
                limit: 1,
                mode: "mapbox.places",
            }).send().then(r => {
                resolve(r?.body?.features[0])
            }).catch(err => {
                reject(err)
            })

        })

    }

}