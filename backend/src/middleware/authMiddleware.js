const jwt =
    require("jsonwebtoken");

const User =
    require("../models/User");

const AppError =
    require("../errors/appError");
module.exports =
async (
    req,
    res,
    next
) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith(
            "Bearer"
        )
    ) {

        token =
            req.headers.authorization
                .split(" ")[1];

    }

    if (!token) {

        return next(
            new AppError(
                "Not authorized",
                401
            )
        );

    }

    const decoded =
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

    req.user =
        await User.findById(
            decoded.id
        );

    next();
};