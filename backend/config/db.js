import mongoose from "mongoose";

// two ways to deifne function
// 1. function name(){}
// 2. var_name = () => {}

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected.")
    }
    catch(error){
        console.log(`Not connecting to database due to ${error}`)
    }
}

export default connectDb;