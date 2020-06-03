import paginatorExpress from 'express-paginate'

 
export default Object.assign(paginatorExpress, {calculate: (count, limit) => {
    return Math.ceil(count / limit)
}})