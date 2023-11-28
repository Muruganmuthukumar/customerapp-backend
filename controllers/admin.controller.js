
const adminLogin = (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === "admin" && password === "admin") {
            res.status(200).json("Admin LogIn Successfully");
        }
        else{ 
            throw new Error("Wrong credentials");
        }
    }
    catch (err) { 
        res.status(401).json(err.message)
    }
}

module.exports = {
    adminLogin
};