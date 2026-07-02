const orderModel = require("../model/order.model");
const userModel = require("../model/auth.model");
const productModel = require("../model/product.model");

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      recentOrders,
      totalRevenueData,
    ] = await Promise.all([
      userModel.countDocuments(),

      orderModel.countDocuments(),

      productModel.countDocuments(),

      orderModel
        .find({})
        .populate("user", "name email")
        .populate("items.productId", "name price imageUrl")
        .sort({ createdAt: -1 }),

      orderModel.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      totalRevenueData.length > 0
        ? totalRevenueData[0].totalRevenue
        : 0;

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",

      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
      },

      recentOrders,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getAdminStats };