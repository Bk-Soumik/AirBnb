const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listingSchema");

main()
.then((res) => {
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initDB = async() => {
   await Listings.deleteMany({});
   initData.data = initData.data.map((obj) => ({
    ...obj,
     owner: "6779172af6c76f4d1743bd49",
    }));
   await Listings.insertMany(initData.data);
   console.log("Data was re-initialized");
};

initDB();


