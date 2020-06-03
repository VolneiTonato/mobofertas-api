import axios from 'axios'
import { assign } from 'lodash'
import https from 'https'

const apiKey = process.env.HERE_MAP_APP_KEY
const apiId = process.env.HEREM_AP_APP_ID

export default class HereMapHelper {


    static async searchGeocode(stringEndereco, limit = 1) {

        return new Promise((resolve, reject) => {

            try {

                axios.get('https://geocode.search.hereapi.com/v1/geocode', {
                    params: {
                        apiKey: apiKey,
                        q: stringEndereco,
                        limit: limit
                    }
                }).then(({ data }) => {
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })

            } catch (err) {
                reject(err)
            }


        })


    }

    static async imageCreate(options = {
        w, h, z, ppi, poix: {
            lat, lng, background, color, description
        }
    }) {

        let defaultOptions = {
            w: 1000, h: 1000, z: 15, ppi: 72, poix: {
                lat: 0, lng: 0, background: 'white', color: 'green', description: 'MOBOFERTAS'
            }
        }

        defaultOptions = assign(defaultOptions, options)


        return new Promise((resolve, reject) => {

            try {

                const param = {
                    apiKey: apiKey,
                    style: 'fleet',
                    w: defaultOptions.w,
                    h: defaultOptions.h,
                    z: defaultOptions.z,
                    sb: 'km',
                    ppi: defaultOptions.ppi,
                    pip: 10,
                    ml: 'bra',
                    t: 0,
                    f:0, //PNG
                    poix: `${defaultOptions.poix.lat},${defaultOptions.poix.lng};white;green;20;${defaultOptions.poix.description}`
                }

                axios.get('https://image.maps.ls.hereapi.com/mia/1.6/mapview', {
                    responseType: 'arraybuffer',
                    params: param
                }).then(({ data }) => {
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })


            } catch (err) {
                reject(err)
            }
        })
    }


    static createLinkPesquisa({ lat, lng }) {

        try {

            if (lat && lng)
                return `https://share.here.com/l/${lat},${lng}`
            return ''
        } catch (err) {
            return err
        }
    }

}