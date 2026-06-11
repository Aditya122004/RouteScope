function dijkstra(graph, start) {

    const distances = {};
    const previous = {};
    const visited = new Set();

    for (const node in graph) {
        distances[node] = Infinity;
    }

    distances[start] = 0;

    while (visited.size < Object.keys(graph).length) {

        let currentNode = null;

        for (const node in distances) {

            if (
                !visited.has(node) &&
                (currentNode === null ||
                 distances[node] < distances[currentNode])
            ) {
                currentNode = node;
            }
        }

        if (currentNode === null) {
            break;
        }

        visited.add(currentNode);

        for (const neighbor in graph[currentNode]) {

            const cost = graph[currentNode][neighbor];

            const newDistance =
                distances[currentNode] + cost;

            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = currentNode;
            }
        }
    }

    return {distances,previous};
}

module.exports = dijkstra;