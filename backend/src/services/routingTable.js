const dijkstra = require("../algorithms/dijkstra");

function buildRoutingTable(graph, source) {

    const { distances, previous } = dijkstra(graph, source);

    const routingTable = {};

    for (const destination in distances) {

        if (
            destination === source ||
            distances[destination] === Infinity
        ) {
            continue;
        }

        let current = destination;

        while (
            previous[current] &&
            previous[current] !== source
        ) {
            current = previous[current];
        }

        routingTable[destination] = {
            cost: distances[destination],
            nextHop: current
        };
    }

    return routingTable;
}
function generateAllRoutingTables(graph) {

    const tables = {};

    for (const router in graph) {
        tables[router] =
            buildRoutingTable(graph, router);
    }

    return tables;
}

module.exports = {
    buildRoutingTable,
    generateAllRoutingTables
};