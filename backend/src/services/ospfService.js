const Network = require("../models/Network");

const {
    generateAllRoutingTables
} = require("./routingTable");

class OSPFService {

    constructor() {
        this.network = new Network();
    }

    addRouter(routerId) {
        this.network.addRouter(routerId);
    }

    addLink(source, destination, cost) {
        if(cost <= 0){
    throw new Error("Link cost must be positive");
}
if(source===destination){
    throw new Error("No Self Loops are allowed");
}
        this.network.addLink(
            source,
            destination,
            cost
        );
    }

    removeLink(source, destination) {
        this.network.removeLink(
            source,
            destination
        );
    }

    updateLinkCost(
        source,
        destination,
        cost
    ) {
        this.network.updateLinkCost(
            source,
            destination,
            cost
        );
    }

    bringRouterDown(routerId) {
        this.network.bringRouterDown(
            routerId
        );
    }

    bringRouterUp(routerId) {
        this.network.bringRouterUp(
            routerId
        );
    }

    getTopology() {
        return this.network.getActiveTopology();
    }

    getRoutingTables() {
        return generateAllRoutingTables(
            this.network.getActiveTopology()
        );
    }

    recalculate() {
    return this.getRoutingTables();
}
}

module.exports = OSPFService;