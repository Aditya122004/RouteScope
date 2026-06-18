const mongoose =
    require("mongoose");

const topologySchema =
    new mongoose.Schema(
        {

            userId: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            name: {
                type: String,
                required: true
            },

            graph: {
                type: Object,
                required: true
            },

            routerStatuses: {
                type: Object,
                required: true
            }

        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Topology",
        topologySchema
    );