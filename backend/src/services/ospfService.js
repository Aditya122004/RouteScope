const Network = require("../models/Network");

const {
    generateAllRoutingTables
} = require("./routingTable");
const AppError =
    require("../errors/appError");

class OSPFService {

    constructor() {
        this.network = new Network();
    }

    addRouter(routerId) {

    if (!routerId) {

        throw new AppError(
            "Router ID required",
            400
        );

    }

    if (
        this.routerExists(routerId)
    ) {

        throw new AppError(
            `Router ${routerId} already exists`,
            409
        );

    }

    this.network.addRouter(
        routerId
    );

}

    addLink(
    source,
    destination,
    cost
) {

    this.ensureRouterExists(
        source
    );

    this.ensureRouterExists(
        destination
    );

    if (
        source === destination
    ) {

        throw new AppError(
            "Router cannot connect to itself",
            400
        );

    }

    if (cost <= 0) {

        throw new AppError(
            "Cost must be positive",
            400
        );

    }

    if (
        this.linkExists(
            source,
            destination
        )
    ) {

        throw new AppError(
            "Link already exists",
            409
        );

    }

    this.network.addLink(
        source,
        destination,
        cost
    );

}

    removeLink(
    source,
    destination
) {

    this.ensureLinkExists(
        source,
        destination
    );

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

    this.ensureLinkExists(
        source,
        destination
    );

    if (cost <= 0) {

        throw new AppError(
            "Cost must be positive",
            400
        );

    }

    this.network.updateLinkCost(
        source,
        destination,
        cost
    );

}

    bringRouterDown(routerId) {

    this.ensureRouterExists(
        routerId
    );

    this.network.bringRouterDown(
        routerId
    );

}

    bringRouterUp(routerId) {

    this.ensureRouterExists(
        routerId
    );

    this.network.bringRouterUp(
        routerId
    );

}
getRouterStatuses() {
    return this.network.routers;
}
getNetworkState() {

    return {

        topology:
            this.getTopology(),

        routingTables:
            this.getRoutingTables(),

        routerStatuses:
            this.getRouterStatuses()

    };

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
routerExists(routerId) {
    return this.network.routerExists(routerId);
}

linkExists(source, destination) {
    return this.network.linkExists(
        source,
        destination
    );
}

ensureRouterExists(routerId) {

    if (!this.routerExists(routerId)) {

        throw new AppError(
            `Router ${routerId} not found`,
            404
        );

    }

}

ensureLinkExists(
    source,
    destination
) {

    if (
        !this.linkExists(
            source,
            destination
        )
    ) {

        throw new AppError(
            "Link not found",
            404
        );

    }

}
}

module.exports = OSPFService;