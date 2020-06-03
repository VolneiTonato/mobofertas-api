import MunicipioEstadoSchema from '../schemas/municipio.schema'
import MasterRepository from './masterRespository'


export default class MunicipioEstadoRepository extends MasterRepository{

    constructor(){
        super(MunicipioEstadoSchema)
    }
    

}