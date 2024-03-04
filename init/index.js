const mongoose = require("mongoose")
const initData = require("./data.js");
const listingdata= require("../models/listing.js")

const url="mongodb://127.0.0.1:27017/wonderLust";

main().then(()=>{
console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(url)
}
const initDB= async()=>{
   await listingdata.deleteMany({});
 initData.data=initData.data.map((obj)=>({...obj,owner:"65e1608f199fc2cc3abb4d25"}))
   await listingdata.insertMany(initData.data);
   console.log("data was initilized");
   
    
}
initDB()