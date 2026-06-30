const orderModel = require("../model/order.model");
const sendEmail = require("../utils/sendMail");
const orderSuccessTemplate = require("../templates/orderSuccess.template");
const productModel = require("../model/product.model");


const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;

    if (!items || !totalAmount || !address || !paymentId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Validate Products
    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      if (item.price !== product.price) {
        return res.status(400).json({
          success: false,
          message: "Product price has changed. Please refresh your cart.",
        });
      }
    }

    const order = await orderModel.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentId,
    });

    // Populate product names for email
    const populatedOrder = await orderModel
      .findById(order._id)
      .populate("items.productId", "name");

    await sendEmail({
      to: req.user.email,
      subject: `🎉 Order #${order._id} Confirmed`,
      html: orderSuccessTemplate({
        customerName: req.user.name,
        orderId: order._id,
        totalAmount,
        paymentId,
        address,
        items: populatedOrder.items,
      }),
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getOrderById = async(req,res) =>{
  try{
    const orders = await orderModel.find({user:req.user._id}).populate('items.productId','name price imageUrl');
      if (orders.length === 0) {
          return res.status(404).json({
              success:false,
              message:"No orders found"
          });
      }
      return res.status(200).json({
        success:true,
        orders
      });
    }catch(error){
      console.error(error);
      res.status(500).json({
        success:false,
        message:"Internal Server Error"
      });
    }
}

const getOrders = async(req,res) =>{
  try{
    const orders = await orderModel.find({}).populate('items.productId','name price imageUrl');
    if (orders.length === 0) {
        return res.status(404).json({
            success:false,
            message:"No orders found"
        });
    }
    return res.status(200).json({
      success:true,
      orders
    });
  }
  catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

const updateOrderStatus = async(req,res) =>{
  try{
    const {status} = req.body;
    if(!status){
      return res.status(400).json({
        success:false,
        message:"Status is required"
      })
    };
    const order = await orderModel.findById(req.params.id);
    if(!order){
      return res.status(404).json({
        success:false,
        message:"Order not found"
      })
    };
    order.status = status;
    await order.save();
    return res.status(200).json({
      success:true,
      message:"Order status updated successfully",
      order
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

module.exports = {createOrder,getOrders,getOrderById,updateOrderStatus}