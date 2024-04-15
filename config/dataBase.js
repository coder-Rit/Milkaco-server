const mongoose = require("mongoose")


const connectTODatabase = ()=>{
    mongoose.connect(process.env.DB_URI1 ).then(()=>{
        console.log(`connectTODatabase is successfull`);
    }).catch(err=>console.log(`db error ${err}`))
}
 
module.exports = connectTODatabase
         