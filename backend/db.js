const mongoose =require ('mongoose');
const mongoURI="mongodb://localhst:27017/"

const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connected to mongo successfully");
    })
}

module.exports =connectToMongo;
