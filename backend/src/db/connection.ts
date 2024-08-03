import { connect, disconnect } from 'mongoose';

export default async function connectToDatabse() {
    try {
        await connect(process.env.MONGODB_URL);
    } catch(error){
        console.log(error);
        throw new Error("Cannot Connect To MongoDb");
    }
}

async function disconnectFromDatabase(){
    try{
        await disconnect();
    }catch(error){
        console.log(error);
        throw new Error("Cannot Connect To MongoDb");
    }
}

export { connectToDatabse, disconnectFromDatabase};