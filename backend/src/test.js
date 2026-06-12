const OSPFService =
    require("./services/ospfService");

const ospf = new OSPFService();

ospf.addLink("A", "B", 10);
ospf.addLink("A", "C", 5);
ospf.addLink("C", "B", 2);

console.log("Initial Topology");
console.log(ospf.getTopology());

console.log("Routing Tables");
console.log(ospf.getRoutingTables());

ospf.updateLinkCost(
    "A",
    "C",
    20
);

console.log(
    ospf.getRoutingTables()
);

ospf.removeLink(
    "C",
    "B"
);

console.log(
    ospf.getRoutingTables()
);

ospf.bringRouterDown("C");

console.log(
    ospf.getRoutingTables()
);