import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

import RouterNode from "./RouterNode";
import LinkEdge from "./LinkEdge";
import { useNetworkStore } from "../store/networkStore";

const NODE_TYPES = { router: RouterNode };
const EDGE_TYPES = { link: LinkEdge };

// Arrange nodes in a circle if no position saved
function getInitialPosition(index, total, existingPos) {
  if (existingPos) return existingPos;
  const angle = (2 * Math.PI * index) / Math.max(total, 1);
  const radius = Math.min(250, 80 + total * 40);
  return {
    x: 400 + radius * Math.cos(angle),
    y: 280 + radius * Math.sin(angle),
  };
}

export default function NetworkCanvas() {
  const { topology, routerStatuses, setSelectedRouter } = useNetworkStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Track whether this is the very first load so fitView only fires once
  const didFitView = useMemo(() => ({ current: false }), []);

  // Keep a map of router => position so dragging persists across re-renders
  const positionCache = useMemo(() => new Map(), []);

  useEffect(() => {
    const routerIds = Object.keys(routerStatuses);

    // Build nodes — always from routerStatuses so down routers stay visible
    const newNodes = routerIds.map((id, index) => {
      if (!positionCache.has(id)) {
        positionCache.set(id, getInitialPosition(index, routerIds.length, null));
      }
      return {
        id,
        type: "router",
        position: positionCache.get(id),
        // routerId is all RouterNode needs; isUp is read from store inside the component
        data: { routerId: id },
      };
    });

    // Build edges — only one per pair (A-B, not both A-B and B-A)
    const seen = new Set();
    const newEdges = [];

    for (const [src, links] of Object.entries(topology)) {
      for (const [dst, cost] of Object.entries(links)) {
        const key = [src, dst].sort().join("-");
        if (seen.has(key)) continue;
        seen.add(key);

        newEdges.push({
          id: key,
          source: src,
          target: dst,
          type: "link",
          data: { source: src, target: dst, cost },
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [topology, routerStatuses]);

  // Cache positions when nodes are dragged
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          positionCache.set(change.id, change.position);
        }
      });
    },
    [onNodesChange, positionCache]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedRouter(null);
  }, [setSelectedRouter]);

  const hasRouters = Object.keys(routerStatuses).length > 0;

  return (
    <div className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onPaneClick={handlePaneClick}
        // fitView only on initial render, not on every topology change
        fitView={!didFitView.current}
        onInit={() => { didFitView.current = true; }}
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ animated: false }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="#1a2a3a"
        />
        <Controls
          style={{
            background: "#0d1117",
            border: "1px solid #1e2d3d",
            borderRadius: "6px",
          }}
        />
        <MiniMap
          nodeColor={(node) => {
            // routerStatuses is the source of truth, not node.data
            const status = routerStatuses[node.id];
            return status ? "#00ff88" : "#ff4444";
          }}
          maskColor="rgba(0,0,0,0.6)"
          style={{
            background: "#0d1117",
            border: "1px solid #1e2d3d",
            borderRadius: "6px",
          }}
        />
      </ReactFlow>

      {/* Empty state — keyed off routerStatuses, not topology */}
      {!hasRouters && (
        <div className="canvas-empty">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="12" rx="2" stroke="#2a4a6b" strokeWidth="1.5" />
              <circle cx="7" cy="12" r="1.5" fill="#2a4a6b" />
              <circle cx="12" cy="12" r="1.5" fill="#2a4a6b" />
              <circle cx="17" cy="12" r="1.5" fill="#2a4a6b" />
            </svg>
          </div>
          <p className="empty-title">No routers yet</p>
          <p className="empty-hint">Use "Add Router" above to start building the network</p>
        </div>
      )}
    </div>
  );
}