import { Types } from 'mongoose'
const erros = Symbol('erros')
import { map } from 'lodash'


export default class MasterRepository {

    constructor(schema) {
        this._model = schema
    }


    async deleteOne(where = {}) {
        try {
            this._model.deleteOne(where, (err) => {
                return new Error(err)

                return true
            })
        } catch (err) {
            return new Error(err)
        }

    }


    oneDoc(result) {
        try {
            if (result?.length)
                return result[0]
            return {}
        } catch (err) {
            throw err
        }
    }

    async count() {
        return new Promise((resolve, reject) => {


            this._model.countDocuments({}, (err, count) => {
                if (err)
                    reject(err)

                resolve(count)

            })
        })
    }


    async update(where = {}, setters = {}) {

        return new Promise(async (resolve, reject) => {

            try {

                if (!Object.getOwnPropertyNames(where).length)
                    throw `Param where update is empty!`

                if (!Object.getOwnPropertyNames(setters).length)
                    throw `Param setters update is empty!`

                this._model.updateOne(
                    where,
                    { $set: setters }, { runValidators: true, context: 'query' })
                    .exec(err => {
                        if (err)
                            return reject(err)
                        return resolve(true)
                    })

            } catch (err) {
                reject(err)
            }

        })
    }

    async findToMongoose(where) {

        return new Promise((resolve, reject) => {


            try {
                this._model.find(where).exec((err, doc) => {
                    if (err)
                        return reject(err)

                    resolve(doc)
                })
            } catch (err) {
                reject(err)
            }
        })
    }



    async find(query = {}, fields, options = {
        populate: null,
        sort: null, limit: null, skip: null, paginator: null, random: null
    }) {

        this.paramOverride(query)

        let count

        return new Promise(async (resolve, reject) => {

            try {

                let dbQuery = this._model.find(query)


                if (options?.populate) {

                    if (Array.isArray(options?.populate))
                        options?.populate.map(pop => dbQuery.populate(pop))
                    else
                        dbQuery.populate(options?.populate)


                }

                if (options?.paginator === true)
                    count = await this.count()


                if (fields)
                    dbQuery.select(fields)


                if (options?.skip) {
                    dbQuery.setOptions({ skip: parseInt(options?.skip) })


                }


                if (options?.limit)
                    dbQuery.setOptions({ limit: parseInt(options?.limit) })

                dbQuery.lean({ getters: true }).exec(async (err, doc) => {
                    if (err)
                        return reject(err)

                    try {

                        if (count)
                            return resolve([doc, count])

                        return resolve(doc)

                    } catch (err) {
                        reject(err)
                    }

                })

            } catch (err) {
                return reject(err)
            }

        })


    }


    static createObjectID(id) {
        try {
            return Types.ObjectId(id)
        } catch (err) {
            return id
        }
    }

    paramOverride(param = {}) {
        try {
            let { _id } = param
            if (_id) {
                param['_id'] = Types.ObjectId(_id)
            }

            return param
        } catch (err) {
            return param
        }
    }

    [erros](err) {
        if (err?.errors) {

            let msg = []


            for (let property in err.errors) {
                msg.push(err.errors[property].message)
            }

            return msg.join("\n\r")
        }
        return err.toString()
    }

    async save(data) {
        try {

            let schema = await new this._model(data)

            this.validate(schema)

            return await schema.save()

        } catch (err) {
            throw err
        }
    }



    validate(schemaSetter) {


        try {

            let err = schemaSetter.validateSync()

            if (err) {
                throw err
            }

            return true

        } catch (err) {
            let msg = this[erros](err)

            throw msg
        }

    }
}