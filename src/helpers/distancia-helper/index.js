import { get } from 'axios'
import { load } from 'cheerio'

const link = `https://www.melhoresrotas.com/widget/v1/route`

const param = {
    defaultFrom: "",
    defaultTo: "",
    defaultVia: "",
    defaultFuelConsumption: "",
    defaultFuelPrice: "",
    defaultSpeedLimitMotorway: "",
    defaultSpeedLimitOther: "",
    showVia: "0",
    showSpeedProfile: "0",
    showFuelCalc: "0",
    showResultLength: 1,
    showResultDrivingTime: 1,
    showResultFuelAmount: 0,
    showResultFuelCost: 0,
    showResultCustomizedCost: 0,
    showResultMap: 0,
    showResultScheme: 0,
    onlyCountries: "",
    preferCountries: "",
    measure: "metric",
    customizedCostFormula: "",
    customizedCostLabel: "",
    v: "",
    sm: 110,
    so: 90,
    fc: "8.00",
    fp: "4.23"
}

export default class Distancia {

    static async get(from, to) {

        try {

            let data = { ...param, ...{ from, to } }

            let response = await get(link, { params: data })

            let document = load(response.data)

            return document('#total_distance').text()

        } catch (err) {

            return ''
        }
    }
}