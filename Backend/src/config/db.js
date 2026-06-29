const mongoose = require('mongoose');

const connectDB = async () =>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected Successfully');
  }catch(error){
    console.log('MongoDB Connection failed',error.message);
    process.exit(1);
  }
}

module.exports = connectDB;