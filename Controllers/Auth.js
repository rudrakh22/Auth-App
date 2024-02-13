const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
            success: false,
            message: "user already exists",
        });
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        res.status(500).json({
        success: false,
        message: "hashing of password failed",
        });
    }

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    res.status(200).json({
        success: true,
        message: "user created successfully",
    });
    } catch (err) {
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "user cannot be registered, please try again later",
    });
    }
};

exports.login = async (req, res) => {
    try {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404).json({
        success: false,
        message: "Please fill all the fields",
        });
    }

    let user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found,kindly register first",
        });
    }

    const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
        });

        user = user.toObject();
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        message: "user log in successfully",
        });

        // res.status(200).json({
        // success: true,
        // token,
        // user,
        // message: "user log in successfully",
        // });
    } else {
        return res.status(500).json({
            success: false,
            message: "password is incorrect",
        });
    }
    } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:'Login Failure',
    })
}}
