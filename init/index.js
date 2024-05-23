const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = await initdata.data.map((obj)=> ({...obj, owner: "663bcc6cc1ab07f107f04f52"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized! ");
};

initDB();