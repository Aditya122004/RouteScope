const express = require("express");
const router = express.Router();

const ospf = require("../config/ospfInstance");
const catchAsync =
    require("../utils/catchAsync");

const {
    validateRouterId,
    validateCost,
    validateLink
} = require("../utils/validators");

router.post(
    "/router",
    catchAsync(
        async (
            req,
            res
        ) => {

            const {
                routerId
            } = req.body;

            validateRouterId(
                routerId
            );

            ospf.addRouter(
                routerId
            );

            res.json({
    success: true,
    state:
        ospf.getNetworkState()
});

        }
    )
);

router.post(
    "/link",
    catchAsync(
        async (
            req,
            res
        ) => {

            const {
                source,
                destination,
                cost
            } = req.body;

            validateLink(
                source,
                destination
            );

            validateCost(
                cost
            );

            ospf.addLink(
                source,
                destination,
                cost
            );

           res.json({
    success: true,
    state:
        ospf.getNetworkState()
});

        }
    )
);

router.delete(
    "/link",
    catchAsync(
        async (req, res) => {

            const {
                source,
                destination
            } = req.body;

            validateLink(
                source,
                destination
            );

            ospf.removeLink(
                source,
                destination
            );

            res.json({
    success: true,
    message:'Link deleted successfully',
    state:
        ospf.getNetworkState()
});

        }
    )
);

router.put(
    "/link/cost",
    catchAsync(
        async (req, res) => {

            const {
                source,
                destination,
                cost
            } = req.body;

            validateLink(
                source,
                destination
            );

            validateCost(
                cost
            );

            ospf.updateLinkCost(
                source,
                destination,
                cost
            );

            res.json({
    success: true,
    message:'Link updated successfully',
    state:
        ospf.getNetworkState()
});

        }
    )
);

router.post(
    "/router/down",
    catchAsync(
        async (req, res) => {

            const {
                routerId
            } = req.body;

            validateRouterId(
                routerId
            );

            ospf.bringRouterDown(
                routerId
            );

            res.json({
    success: true,
    message:`Router ${routerId}is down`,
    state:
        ospf.getNetworkState()
});

        }
    )
);

router.post(
    "/router/up",
    catchAsync(
        async (req, res) => {

            const {
                routerId
            } = req.body;

            validateRouterId(
                routerId
            );

            ospf.bringRouterUp(
                routerId
            );

            res.json({
    success: true,
    message:`Router ${routerId} is up`,
    state:
        ospf.getNetworkState()
});

        }
    )
);

router.get("/topology", (req, res) => {

    res.json(
        ospf.getTopology()
    );

});

router.get("/routing-tables", (req, res) => {

    res.json(
        ospf.getRoutingTables()
    );

});

module.exports=router;