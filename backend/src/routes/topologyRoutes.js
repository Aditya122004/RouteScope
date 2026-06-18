const express =
    require("express");

const router =
    express.Router();

const protect =
    require(
        "../middleware/authMiddleware"
    );

const catchAsync =
    require(
        "../utils/catchAsync"
    );

const {

    saveTopology,

    getTopologies,

    getTopology,

    deleteTopology

} = require(
    "../controllers/topologyController"
);

router.use(protect);

router.post(
    "/",
    catchAsync(saveTopology)
);

router.get(
    "/",
    catchAsync(getTopologies)
);

router.get(
    "/:id",
    catchAsync(getTopology)
);

router.delete(
    "/:id",
    catchAsync(deleteTopology)
);

module.exports = router;