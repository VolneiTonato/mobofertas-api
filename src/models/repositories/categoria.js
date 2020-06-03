import CategoriaSchema from '../schemas/categoria.schema'
import MasterRepository from './masterRespository'


export default class CategoriaRepository extends MasterRepository{

    constructor(){
        super(CategoriaSchema)
    }
    

}