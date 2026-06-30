const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    items:[{
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
      },
      quantity:{
        type:Number,
        required:true,
      },
      price:{type:Number,required:true,min:0}
  }], 
  totalAmount : {
    type:Number,
    required:true,
  },
  address:{
    fullName:{
      type:String,
      required:true,
    },
    Street:{
      type:String,
      required:true,
    },
    city:{
      type:String,
      required:true,
    },
    postalCode:{
      type:String,
      required:true,
    },
    country:{
      type:String,
      required:true,
    }
  },
  paymentId:{
    type:String,
    required:true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },

},{
  timestamps:true,
});

module.exports = mongoose.model("Order",orderSchema);