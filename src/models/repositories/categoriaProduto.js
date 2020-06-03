import CategoriaProdutoSchema from '../schemas/categoria-produto.schema'
import MasterRepository from './masterRespository'

export default class CategoriaProdutoRepository extends MasterRepository{

    constructor(){
        super(CategoriaProdutoSchema)
    }

}