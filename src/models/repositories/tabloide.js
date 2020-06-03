import TabloideSchema from '../schemas/tabloide.schema'
import MasterRepository from './masterRespository'

export default class TabloideRepository extends MasterRepository {

    constructor() {
        super(TabloideSchema)
    }

    async find(param = {query, fields, options}) {

        return await super.find(
            param.query,
            param.fields,
            {populate: { path: 'categorias', select: '-_id +descricaoo' }, ...param.options }
        )
    }

}