const Product = require("../models/product.model");
const client = require('../redis')
const DEFAULT_EXPIRATION = 3600;

const getAllProducts = async (req, res) => {
    try {
        const cachedProducts = await client.get('products')
        if (cachedProducts != null) {
            res.status(200).json(JSON.parse(cachedProducts));
        }
        else {
            const products = await Product.find();
            client.setEx("products",DEFAULT_EXPIRATION, JSON.stringify(products))
            if (!products) {
                throw new Error("Server Busy");
            }
            res.status(200).json(products);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById({ _id: id });
        if (!product) {
            throw new Error("Product not found");
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};


const newProduct = async (req, res) => {
    const { title, brand, category, stock, price, thumbnail } = req.body;
    try {
        const product = new Product({ title, brand, category, stock, price, thumbnail });
        const existingProduct = await Product.findOne({ title: title });
        if (existingProduct) {
            throw new Error("Product already exists!");
        } else {
            await product.save();
            client.del('products')
            res.status(201).json("Product added sucessfully");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const editProduct = async (req, res) => {
    // console.log(req.params.id)
    const { title } = req.body;
    try {
        const existingProduct = await Product.findOne({ title: { $regex: new RegExp(title, 'i') }, _id: { $ne: req.params.id } });
        if (existingProduct) {
            res.status(400).json({ error: "Product with this title already exists" });
        } else {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );

            if (updatedProduct) {
                client.del('products')
                res.status(200).json(updatedProduct);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
            // console.log(JSON.stringify(updatedProduct))
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (deletedProduct) {
            client.del('products')
            res.json({ message: 'Product Deleted Successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    newProduct,
    editProduct,
    deleteProduct
}