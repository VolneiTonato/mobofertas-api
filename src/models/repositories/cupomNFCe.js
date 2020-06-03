import CupomNFCESchema from '../schemas/cupom-nfce.schema'
import MasterRepository from './masterRespository'


export default class CupomNFCeRepository extends MasterRepository{

    constructor(){
        super(CupomNFCESchema)
    }
    

}