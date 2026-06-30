const Razorpay = require("razorpay");
const crypto = require("crypto");
dotenv = require("dotenv").config();
const createOrder = async(req,res) => {
try{
  const instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
  });
  const options = {
    amount:req.body.amount*100,
    currency:"INR",
    receipt:crypto.randomBytes(10).toString("hex"),
  };
  const order = await instance.orders.create(options);
  if(!order){
    return res.status(500).json({
      success:false,
      message:"Something went wrong"
    })
  };
  return res.status(201).json({
    success:true,
    order
  });

}catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
};

const verifyPayment = async(req,res) => {
try{
  const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
  if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature){
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  };

  const generatedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(razorpay_payment_id + "|" + razorpay_order_id).digest("hex");
  if(generatedSignature !== razorpay_signature){
    return res.status(400).json({
      success:false,
      message:"Invalid signature"
    })
  };
  return res.status(200).json({
    success:true,
    message:"Payment verified successfully"
  });
}catch(error){
  console.error(error);
  return res.status(500).json({
    success:false,
    message:"Internal Server Error"
  });
}
};

module.exports = {createOrder,verifyPayment};