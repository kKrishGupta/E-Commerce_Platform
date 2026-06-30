const productModel = require("../model/product.model");
const cloudinary = require("../config/cloudinary.config");
const mongoose = require("mongoose");


const getProducts = async(req,res) =>{
  try{
    const products = await productModel.find({});
    if (products.length === 0) {
      return res.status(200).json({
          success: true,
          products: [],
          message: "No products found",
      });
    }
    return res.status(200).json({
      success:true,
      products
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

const createProduct = async(req,res) =>{
  try{
  const {name,description,price,category,stock} = req.body;
    if (!name || !description || !price || !category || stock == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
  }
  let imageUrl = '';

  if(!req.file){
    return res.status(400).json({
        success: false,
        message: "Product image is required.",
    });
  }
  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path);
  } catch (cloudinaryError) {
    console.error("Cloudinary Upload Error:", {
      message: cloudinaryError.message,
      http_code: cloudinaryError.http_code,
      name: cloudinaryError.name,
    });

    const errorResponse = {
      success: false,
      message: "Internal Server Error",
    };

    if (process.env.NODE_ENV !== "production") {
      errorResponse.error = {
        message: cloudinaryError.message,
        http_code: cloudinaryError.http_code,
        name: cloudinaryError.name,
      };
    }

    return res.status(500).json(errorResponse);
  }
  imageUrl = result.secure_url;

  const product = new productModel ({
    name,
    description, 
    price,
    category,
    imageUrl,
    stock,
  });
    await product.save();
    return res.status(201).json({
      success:true,
      message:"Product created successfully",
      product
    })
  } catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

const getProductById = async(req,res) =>{

  try{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await productModel.findById(req.params.id);

    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }
    return res.status(200).json({
      success:true,
      product
    });
  }catch(error){
    console.error("Get Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // Find Product
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update Fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;

    // Upload New Image
    if (req.file) {
      let result;
      try {
        result = await cloudinary.uploader.upload(req.file.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary Upload Error:", {
          message: cloudinaryError.message,
          http_code: cloudinaryError.http_code,
          name: cloudinaryError.name,
        });

        const errorResponse = {
          success: false,
          message: "Internal Server Error",
        };

        if (process.env.NODE_ENV !== "production") {
          errorResponse.error = {
            message: cloudinaryError.message,
            http_code: cloudinaryError.http_code,
            name: cloudinaryError.name,
          };
        }

        return res.status(500).json(errorResponse);
      }

      product.imageUrl = result.secure_url;
    }

    // Save Updated Product
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteProduct = async(req,res) =>{
try{
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
          success: false,
          message: "Invalid Product ID",
      });
  }

  const product = await productModel.findById(req.params.id);
  if(!product){
    return res.status(404).json({
      success:false,
      message:"Product not found"
    })
  }
  await product.deleteOne();
  return res.status(200).json({
    success:true,
    message:"Product deleted successfully"
  })
}catch(error){
  console.error("Delete Product Error:", error);
  return res.status(500).json({
    success:false,
    message:"Internal Server Error"
  });
}
}


module.exports = {getProducts,createProduct,getProductById,updateProduct,deleteProduct}
