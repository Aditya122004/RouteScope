import { memo } from "react";
import { Handle, Position } from "reactflow";
import { useNetworkStore } from "../store/networkStore";
import { ospfApi } from "../api/ospf";

function RouterNode({ data }) {
  const { routerId } = data;
  const { applyState, notify, setSelectedRouter, selectedRouter, routerStatuses } = useNetworkStore();
  const isUp = routerStatuses[routerId] ?? true;

  const isSelected = selectedRouter === routerId;

  const handleToggle = async (e) => {
    e.stopPropagation();
    try {
      const state = isUp
        ? await ospfApi.routerDown(routerId)
        : await ospfApi.routerUp(routerId);
      applyState(state);
      notify("success", `Router ${routerId} is now ${isUp ? "DOWN" : "UP"}`);
    } catch (err) {
      notify("error", err.message);
    }
  };

  const handleClick = () => {
    setSelectedRouter(isSelected ? null : routerId);
  };

  return (
    <div
      onClick={handleClick}
      className={`router-node ${isUp ? "router-up" : "router-down"} ${isSelected ? "router-selected" : ""}`}
    >
      {/* Status glow ring */}
      <div className={`router-glow ${isUp ? "glow-up" : "glow-down"}`} />

      {/* Node body */}
      <div className="router-body">
        <div className="router-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="17" cy="12" r="1.5" fill="currentColor" />
            <line x1="6" y1="6" x2="6" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="6" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="6" x2="18" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="router-id">{routerId}</span>
        <div className={`router-status-dot ${isUp ? "dot-up" : "dot-down"}`} />
      </div>

      {/* Toggle button */}
      <button
        className={`router-toggle ${isUp ? "toggle-down" : "toggle-up"}`}
        onClick={handleToggle}
        title={isUp ? "Take router down" : "Bring router up"}
      >
        {isUp ? "▼ DOWN" : "▲ UP"}
      </button>

      {/* React Flow handles on all sides */}
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

export default memo(RouterNode);