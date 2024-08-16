const express = require("express");
const productDB = require("../models/productschema");
const wishListDB = require("../models/wishlistschema"); // Add the wishlist schema import
const product_routes = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Ensure environment variables are loaded

// Load environment variables
const cloudinaryConfig = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
};

if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  throw new Error('Missing Cloudinary configuration in .env file');
}

cloudinary.config(cloudinaryConfig);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
  },
});
const upload = multer({ storage: storage });

product_routes.post('/addProduct', upload.single('image'), async (req, res) => {
  try {
    const Data = {
      title: req.body.title,
      brand: req.body.description,
      price: req.body.price,
      description: req.body.seller,
      review: req.body.review,
      category: req.body.category,
      rate: req.body.rate,
      seller: req.body.seller,
      quantity: req.body.quantity,
      image: req.file.path
    };
    const data = await productDB(Data).save();
    if (data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        Message: 'Data added successfully',
        data: data,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Data not added',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error,
    });
  }
});

product_routes.get('/viewProduct', async (req, res) => {
  try {
    const data = await productDB.find();
    return res.status(200).json({
      Success: true,
      Error: false,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      ErrorMessage: error,
    });
  }
});

product_routes.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productDB.findByIdAndDelete(id);
    if (data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Data deleted successfully',
        data: data,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Data not deleted',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error,
    });
  }
});

product_routes.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await productDB.findById(id);
    const updatedData = {
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file.path : oldData.image
    };
    const data = await productDB.findByIdAndUpdate(id, updatedData, { new: true });
    if (data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Data updated successfully',
        data: data,
      });
    } else {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Error, Data not updated',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Error: true,
      Success: false,
      Message: 'Internal server error',
      ErrorMessage: error,
    });
  }
});

//***********************************************WISHLIST******************************************************

product_routes.post('/wishlist/addItem', async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const product = await productDB.findById(productId);
    if (!product) {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Product not found'
      });
    }
    const newItem = new wishListDB({
      productId: product._id,
      userId: userId,
    });
    const savedItem = await newItem.save();
    res.status(201).json({
      Success: true,
      Error: false,
      Message: 'Item added to wishlist successfully',
      data: savedItem
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Failed to add item to wishlist',
      ErrorMessage: error.message
    });
  }
});

product_routes.delete('/wishlist/removeItem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removedItem = await wishListDB.findByIdAndDelete(id);
    if (removedItem) {
      res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Item removed from wishlist successfully',
        data: removedItem
      });
    } else {
      res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to remove item from wishlist'
      });
    }
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message
    });
  }
});

product_routes.get('/wishlist/viewItems/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const wishItems = await wishListDB.find({ userId }).populate('productId');
    res.status(200).json({
      Success: true,
      Error: false,
      Message: 'Wishlist items retrieved successfully',
      data: wishItems
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Failed to retrieve wishlist items',
      ErrorMessage: error.message
    });
  }
});

module.exports = product_routes;
