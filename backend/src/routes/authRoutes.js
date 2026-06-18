const express =
    require("express");

const router =
    express.Router();

const catchAsync =
    require("../utils/catchAsync");

const {
    signup,
    login
} = require(
    "../controllers/authController"
);

router.post(
    "/signup",
    catchAsync(signup)
);

router.post(
    "/login",
    catchAsync(login)
);

module.exports = router;