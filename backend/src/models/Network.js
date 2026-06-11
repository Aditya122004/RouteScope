class Network {
    constructor() {
        this.graph = {};
    }

    addRouter(routerId) {
        if (!this.graph[routerId]) {
            this.graph[routerId] = {};
        }
    }

    addLink(source, destination, cost) {
        this.addRouter(source);
        this.addRouter(destination);

        this.graph[source][destination] = cost;
        this.graph[destination][source] = cost;
    }

    removeLink(source, destination) {
        delete this.graph[source][destination];
        delete this.graph[destination][source];
    }

    updateLinkCost(source, destination, newCost) {
        this.graph[source][destination] = newCost;
        this.graph[destination][source] = newCost;
    }

    getTopology() {
        return this.graph;
    }
}

module.exports = Network;