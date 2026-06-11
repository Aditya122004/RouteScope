const Network = require("./models/Network");
const buildRoutingTable = require("./services/routingTable");

const network = new Network();

network.addLink("A", "B", 10);
network.addLink("A", "C", 5);
network.addLink("C", "B", 2);

const table = buildRoutingTable(
    network.getTopology(),
    "A"
);

console.log(table);