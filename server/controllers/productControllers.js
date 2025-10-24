const Product = require("../models/productModel");
const Shop = require("../models/shopModel");

const addProduct = async (req, res) => {
  try {
    const { name, description, images, category, price, stock } = req.body;

    // Add input validation
    if (!name || !description || !images || !category || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Please provide all required product fields" });
    }

    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not Found. You must create a shop first" });
    }

    const product = new Product({
      name,
      description,
      images,
      category,
      price,
      stock,
      shop: shop._id, // Link the product to the found shop's ID
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllProducts=async(req,res)=>{
  try{
    const products=await Product.find({}).populate("shop","name logo");
    res.json(products);
  }catch(error){
    res.status(500).json({message:"Server Error"});
  }
};

const getProductById=async(req,res)=>{
  try{
    const product = await Product.findById(req.params.id).populate('shop', 'name logo description owner');
    if(product){
      res.json(product);
    }else{
      res.status(404).json({message:"Product not found"});
    }
  }catch(error){
    res.status(500).json({message:"Server Error"});
  }
};

module.exports = { addProduct, getAllProducts, getProductById };
