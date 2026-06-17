import { useNetworkStore } from "../store/networkStore";

export default function RoutingTablePanel() {
  const { selectedRouter, routingTables, routerStatuses, setSelectedRouter } =
    useNetworkStore();

  const isOpen = !!selectedRouter;
  const table = selectedRouter ? routingTables[selectedRouter] || {} : {};
  const isUp = selectedRouter ? routerStatuses[selectedRouter] : false;

  const destinations = Object.entries(table);

  return (
    <div className={`routing-panel ${isOpen ? "panel-open" : "panel-closed"}`}>
      {isOpen && (
        <>
          {/* Panel header */}
          <div className="panel-header">
            <div className="panel-title-row">
              <div className="panel-title-left">
                <div className={`panel-status-dot ${isUp ? "dot-up" : "dot-down"}`} />
                <span className="panel-router-id">Router {selectedRouter}</span>
                <span className={`panel-badge ${isUp ? "badge-up" : "badge-down"}`}>
                  {isUp ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <button
                className="panel-close"
                onClick={() => setSelectedRouter(null)}
                title="Close panel"
              >
                ✕
              </button>
            </div>
            <p className="panel-subtitle">OSPF Routing Table</p>
          </div>

          {/* Table */}
          <div className="panel-body">
            {destinations.length === 0 ? (
              <div className="panel-empty">
                {isUp
                  ? "No routes — add links to populate the routing table."
                  : "Router is offline. Bring it up to view routes."}
              </div>
            ) : (
              <table className="rt-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Next Hop</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map(([dest, info]) => (
                    <tr key={dest} className="rt-row">
                      <td className="rt-dest">{dest}</td>
                      <td className="rt-hop">
                        <span className="hop-badge">{info.nextHop}</span>
                      </td>
                      <td className="rt-cost">{info.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Legend */}
          <div className="panel-footer">
            <span className="panel-legend">
              Click an edge label to edit its cost · Click ✕ on edge to delete
            </span>
          </div>
        </>
      )}
    </div>
  );
}