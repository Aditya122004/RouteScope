class Network {
    constructor() {
        this.graph = {};
        this.routers = {};
    }

    addRouter(routerId) {
        if (!this.graph[routerId]) {
            this.graph[routerId] = {};
            this.routers[routerId] = true; // UP
        }
    }

    addLink(source, destination, cost) {
        this.addRouter(source);
        this.addRouter(destination);

        this.graph[source][destination] = cost;
        this.graph[destination][source] = cost;
    }

    removeLink(source, destination) {
        if (this.graph[source]) {
            delete this.graph[source][destination];
        }

        if (this.graph[destination]) {
            delete this.graph[destination][source];
        }
    }

    updateLinkCost(source, destination, newCost) {
        if (
            this.graph[source] &&
            this.graph[destination]
        ) {
            this.graph[source][destination] = newCost;
            this.graph[destination][source] = newCost;
        }
    }

    bringRouterDown(routerId) {
        if (this.routers[routerId] !== undefined) {
            this.routers[routerId] = false;
        }
    }

    bringRouterUp(routerId) {
        if (this.routers[routerId] !== undefined) {
            this.routers[routerId] = true;
        }
    }

    getActiveTopology() {
        const activeGraph = {};

        for (const router in this.graph) {

            if (!this.routers[router]) {
                continue;
            }

            activeGraph[router] = {};

            for (const neighbor in this.graph[router]) {

                if (this.routers[neighbor]) {
                    activeGraph[router][neighbor] =
                        this.graph[router][neighbor];
                }
            }
        }

        return activeGraph;
    }

    getTopology() {
        return this.graph;
    }
    routerExists(routerId) {
    return this.routers[routerId] !== undefined;
}

linkExists(source, destination) {

    return !!(
        this.graph[source] &&
        this.graph[source][destination] !== undefined
    );

}
}

module.exports = Network;