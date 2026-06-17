import { useState } from "react";
import { ospfApi } from "../api/ospf";
import { useNetworkStore } from "../store/networkStore";

export default function ControlBar() {
  const { applyState, notify, topology } = useNetworkStore();

  // Add Router
  const [routerId, setRouterId] = useState("");
  const [addingRouter, setAddingRouter] = useState(false);

  // Add Link
  const [linkSrc, setLinkSrc] = useState("");
  const [linkDst, setLinkDst] = useState("");
  const [linkCost, setLinkCost] = useState("");
  const [addingLink, setAddingLink] = useState(false);

  const routers = Object.keys(topology);

  const handleAddRouter = async (e) => {
    e.preventDefault();
    const id = routerId.trim().toUpperCase();
    if (!id) return notify("error", "Router ID cannot be empty");
    setAddingRouter(true);
    try {
      const state = await ospfApi.addRouter(id);
      applyState(state);
      notify("success", `Router ${id} added to the network`);
      setRouterId("");
    } catch (err) {
      notify("error", err.message);
    } finally {
      setAddingRouter(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    const src = linkSrc.trim().toUpperCase();
    const dst = linkDst.trim().toUpperCase();
    const cost = parseInt(linkCost, 10);

    if (!src || !dst) return notify("error", "Source and destination required");
    if (src === dst) return notify("error", "Source and destination must differ");
    if (isNaN(cost) || cost <= 0) return notify("error", "Cost must be a positive integer");

    setAddingLink(true);
    try {
      const state = await ospfApi.addLink(src, dst, cost);
      applyState(state);
      notify("success", `Link ${src}↔${dst} (cost ${cost}) added`);
      setLinkSrc("");
      setLinkDst("");
      setLinkCost("");
    } catch (err) {
      notify("error", err.message);
    } finally {
      setAddingLink(false);
    }
  };

  return (
    <div className="control-bar">
      {/* Brand */}
      <div className="control-brand">
        <div className="brand-dot" />
        <span className="brand-text">OSPF<span className="brand-accent">vis</span></span>
      </div>

      <div className="control-divider" />

      {/* Add Router */}
      <form className="control-form" onSubmit={handleAddRouter}>
        <span className="control-label">ADD ROUTER</span>
        <input
          className="control-input"
          placeholder="ID (e.g. A)"
          value={routerId}
          onChange={(e) => setRouterId(e.target.value)}
          maxLength={8}
        />
        <button className="control-btn btn-green" disabled={addingRouter} type="submit">
          {addingRouter ? "…" : "+ Router"}
        </button>
      </form>

      <div className="control-divider" />

      {/* Add Link */}
      <form className="control-form" onSubmit={handleAddLink}>
        <span className="control-label">ADD LINK</span>
        {routers.length >= 2 ? (
          <>
            <select
              className="control-select"
              value={linkSrc}
              onChange={(e) => setLinkSrc(e.target.value)}
            >
              <option value="">Source</option>
              {routers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span className="control-arrow">↔</span>
            <select
              className="control-select"
              value={linkDst}
              onChange={(e) => setLinkDst(e.target.value)}
            >
              <option value="">Dest</option>
              {routers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <input
              className="control-input"
              placeholder="Source"
              value={linkSrc}
              onChange={(e) => setLinkSrc(e.target.value.toUpperCase())}
              maxLength={8}
            />
            <span className="control-arrow">↔</span>
            <input
              className="control-input"
              placeholder="Dest"
              value={linkDst}
              onChange={(e) => setLinkDst(e.target.value.toUpperCase())}
              maxLength={8}
            />
          </>
        )}
        <input
          className="control-input control-cost"
          placeholder="Cost"
          type="number"
          min="1"
          value={linkCost}
          onChange={(e) => setLinkCost(e.target.value)}
        />
        <button className="control-btn btn-blue" disabled={addingLink} type="submit">
          {addingLink ? "…" : "+ Link"}
        </button>
      </form>

      <div className="control-divider" />

      {/* Stats */}
      <div className="control-stats">
        <div className="stat-item">
          <span className="stat-val">{routers.length}</span>
          <span className="stat-key">ROUTERS</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">
            {Object.values(topology).reduce((acc, links) => acc + Object.keys(links).length, 0) / 2 | 0}
          </span>
          <span className="stat-key">LINKS</span>
        </div>
      </div>
    </div>
  );
}