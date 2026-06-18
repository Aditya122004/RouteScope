const Topology =
    require("../models/Topology");

const ospf =
    require("../config/ospfInstance");

    exports.saveTopology =
async (req, res) => {

    const { name } =
        req.body;

    const fullState =
    ospf.getFullState();

const topology =
    await Topology.create({

        userId: req.user._id,

        name,

        graph:
            fullState.graph,

        routerStatuses:
            fullState.routerStatuses

    });

    res.status(201).json({
        success: true,
        topology
    });

};

exports.getTopologies =
async (req, res) => {

    const topologies =
        await Topology.find({
            userId:
                req.user._id
        });

    res.json({
        success: true,
        topologies
    });

};

exports.getTopology =
async (req, res) => {

    const topology =
        await Topology.findOne({

            _id:
                req.params.id,

            userId:
                req.user._id

        });

    res.json({
        success: true,
        topology
    });

};

exports.deleteTopology =
async (req, res) => {

    await Topology.findOneAndDelete({

        _id:
            req.params.id,

        userId:
            req.user._id

    });

    res.json({
        success: true
    });

};