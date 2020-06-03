export default class PromiseHelper{

    static async sleep(time = 1000){

        return new Promise((resolve, reject) => {
            setTimeout(resolve, time)
        })
    }
}