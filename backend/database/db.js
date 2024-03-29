require('dotenv').config();
const mongoose = require("mongoose");
const cluster = process.env.CLUSTER;


async function ConnectDatabase(){
    try{
        await mongoose.connect(cluster,{useNewUrlParser:true})
    }catch(err){
        console.error(err);
    }
}

module.exports = ConnectDatabase;


