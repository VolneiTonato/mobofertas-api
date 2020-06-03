import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
})

mongoose.Promise = global.Promise

mongoose.connection.on("error", err => {
    
})




export default mongoose