import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if(connected) {
        console.log("Already connected to DB");
        return;
    }
    
    if(mongoose.connections[0].readyState) {
        console.log("DB in ready state");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        connected = true;
        console.log("Connected to DB");
    } catch (error) {        
        console.log(error);
        throw new Error("Connection to DB failed");
    }
}
    export default connectDB;