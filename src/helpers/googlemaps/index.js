import { Client } from "@googlemaps/google-maps-services-js";

const token = process.env.GOOGLE_MAPS_KEY


export default class GoogleMapsHelper {

    static async distanceMatrix() {
        /*
        g.directions({
            params: {
                origin:'-29.1408226,-51.5202399',
                key: googlekey,
                destination:'-29.173713,-51.512596'
            }
        })*/

        return new Promise((resolve, reject) => {

            new Client().distancematrix({
                params: {
                    origins: '-29.1408226,-51.5202399',
                    key: token,
                    destinations: '-29.173713,-51.512596',
                }
            })
                .then(r => {
                    resolve(r.data)
                }).catch(err => {
                    reject(err)
                })
        })

    }
}
