const User = require("../models/user.model");
const client = require('../redis');
const DEFAULT_EXPIRATION = 3600;

const getAllUser = async (req, res) => {
    try {
        const cachedUsers = await client.get("users")
        if (cachedUsers != null) {
            // console.log(user)
            res.status(200).json(JSON.parse(cachedUsers));
        } else { 
            const users = await User.find();
            client.setEx("users", DEFAULT_EXPIRATION, JSON.stringify(users))
            if (!users) {
                throw new Error("Server Busy");
            }
            res.status(200).json(users);
        } 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getUser = async (req, res) => {
    const { id } = req.params; 
    try {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new Error("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};


const createUser = async (req, res) => {
    const { firstname, lastname, email, mobile, membership, photoURL } = req.body;
    try {
        const newUser = new User({ firstname, lastname, email, mobile, membership, photoURL });
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            res.status(400).json({ error: "User already exists!" });
        } else {
            await newUser.save();
            client.del("users");
            res.status(201).json("User created successfully");
        }
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
};


const editUser = async (req, res) => {
    const { email, mobile } = req.body;
    try {
        const existingUser = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(email, 'i') }, _id: { $ne: req.params.id } },
                { mobile: { $regex: new RegExp(mobile, 'i') }, _id: { $ne: req.params.id } }
            ]
        });

        if (existingUser) {
            res.status(400).json({ error: "User with this email or mobile already exists" });
        } else {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            );

            if (updatedUser) {
                client.del("users");
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (deletedUser) {
            client.del("users");
            res.json({ message: 'User Deleted Successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getAllUser, getUser, createUser, editUser, deleteUser
};
