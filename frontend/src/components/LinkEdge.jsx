import { memo, useState, useRef, useEffect } from "react";
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "reactflow";
import { ospfApi } from "../api/ospf";
import { useNetworkStore } from "../store/networkStore";

function LinkEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}) {
  const { source, target, cost } = data;
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(cost));
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef(null);
  const { applyState, notify } = useNetworkStore();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    setInputVal(String(cost));
  }, [cost]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleLabelClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleCostSubmit = async () => {
    const newCost = parseInt(inputVal, 10);
    if (isNaN(newCost) || newCost <= 0) {
      notify("error", "Cost must be a positive integer");
      setInputVal(String(cost));
      setEditing(false);
      return;
    }
    if (newCost === cost) {
      setEditing(false);
      return;
    }
    try {
      const state = await ospfApi.updateLinkCost(source, target, newCost);
      applyState(state);
      notify("success", `Link ${source}↔${target} cost updated to ${newCost}`);
    } catch (err) {
      notify("error", err.message);
      setInputVal(String(cost));
    } finally {
      setEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCostSubmit();
    if (e.key === "Escape") {
      setInputVal(String(cost));
      setEditing(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      const state = await ospfApi.deleteLink(source, target);
      applyState(state);
      notify("success", `Link ${source}↔${target} deleted`);
    } catch (err) {
      notify("error", err.message);
      setDeleting(false);
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: "#2a4a6b",
          strokeWidth: 2,
          transition: "stroke 0.2s",
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="edge-label-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          {editing ? (
            <div className="edge-cost-edit">
              <input
                ref={inputRef}
                className="edge-cost-input"
                type="number"
                min="1"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onBlur={handleCostSubmit}
                onKeyDown={handleKeyDown}
              />
            </div>
          ) : (
            <div className="edge-label" onClick={handleLabelClick}>
              <span className="edge-cost-value">{cost}</span>
              <button
                className="edge-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
                title={`Delete link ${source}↔${target}`}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(LinkEdge);