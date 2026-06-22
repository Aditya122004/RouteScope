const User =
    require("../models/User");

const generateToken =
    require("../utils/generateToken");

const AppError =
    require("../errors/appError");

exports.signup =
async (req, res) => {

    const {
        username,
        email,
        password
    } = req.body;

    const exists =
        await User.findOne({
            email
        });

    if (exists) {

        throw new AppError(
            "User already exists",
            409
        );

    }

    const user =
        await User.create({
            username,
            email,
            password
        });

    const token =
        generateToken(
            user._id
        );

    res.status(201).json({
        success: true,
        token
    });

};

exports.login =
async (req, res) => {

    const {
        email,
        password
    } = req.body;

    const user =
        await User.findOne({
            email
        });

    if (
        !user ||
        !(await user.comparePassword(
            password
        ))
    ) {

        throw new AppError(
            "Invalid credentials",
            401
        );

    }

    const token =
        generateToken(
            user._id
        );

    res.json({
        success: true,
        token,
        username: user.username
    });

};