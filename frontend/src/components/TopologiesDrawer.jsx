import { useState, useEffect } from "react";
import { topologiesApi } from "../api/topologies";
import { ospfApi } from "../api/ospf";
import { useAuthStore } from "../store/authStore";
import { useNetworkStore } from "../store/networkStore";
import ConfirmModal from "./ConfirmModal";

export default function TopologiesDrawer({ isOpen, onClose }) {
  const { token } = useAuthStore();
  const { topology, routerStatuses, applyState, notify } = useNetworkStore();

  const [topologies, setTopologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);

  // Confirm modal state
  const [confirmLoad, setConfirmLoad]     = useState(null); // topology object to load
  const [confirmDelete, setConfirmDelete] = useState(null); // topology id to delete

  // Fetch list when drawer opens
  useEffect(() => {
    if (!isOpen || !token) return;
    setLoading(true);
    topologiesApi
      .getAll(token)
      .then((data) => setTopologies(data.topologies || []))
      .catch((err) => notify("error", err.message))
      .finally(() => setLoading(false));
  }, [isOpen, token]);

  const handleSave = async (e) => {
    e.preventDefault();
    const name = saveName.trim();
    if (!name) return notify("error", "Topology name cannot be empty");

    // Build graph from topology (active links) — mirrors what backend expects
    const graph = topology;

    setSaving(true);
    try {
      const data = await topologiesApi.save(token, name, graph, routerStatuses);
      setTopologies((prev) => [
        { _id: data.topology?._id || Date.now(), name, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setSaveName("");
      notify("success", `Topology "${name}" saved`);
    } catch (err) {
      notify("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadConfirmed = async () => {
    const topo = confirmLoad;
    setConfirmLoad(null);
    try {
      const data = await topologiesApi.getById(token, topo._id);

      // The backend stores routerStatuses and graph at the top level of the
      // topology document — there is no networkState wrapper.
      const saved = data.topology;
      const savedRouterStatuses = saved.routerStatuses || {};
      // graph may be missing entirely if topology was saved with no links
      const savedGraph = saved.graph || {};

      // Clear current canvas and replay saved state into the OSPF backend
      await ospfApi.clearTopology();

      // Re-add routers (from routerStatuses which always has all routers)
      for (const routerId of Object.keys(savedRouterStatuses)) {
        await ospfApi.addRouter(routerId);
      }

      // Re-add links (deduplicated — graph is bidirectional)
      const seen = new Set();
      for (const [src, links] of Object.entries(savedGraph)) {
        for (const [dst, cost] of Object.entries(links)) {
          const key = [src, dst].sort().join("-");
          if (seen.has(key)) continue;
          seen.add(key);
          await ospfApi.addLink(src, dst, cost);
        }
      }

      // Apply router statuses (take down any routers that were down when saved)
      for (const [routerId, isUp] of Object.entries(savedRouterStatuses)) {
        if (!isUp) await ospfApi.routerDown(routerId);
      }

      // Fetch fresh state from backend and sync the canvas
      const freshState = await ospfApi.getTopology();
      applyState(freshState);
      notify("success", `Loaded topology "${topo.name}"`);
      onClose();
    } catch (err) {
      notify("error", err.message);
    }
  };

  const handleDeleteConfirmed = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await topologiesApi.delete(token, id);
      setTopologies((prev) => prev.filter((t) => t._id !== id));
      notify("success", "Topology deleted");
    } catch (err) {
      notify("error", err.message);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}

      {/* Drawer */}
      <div className={`drawer ${isOpen ? "drawer-open" : ""}`}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Saved Topologies</h2>
            <p className="drawer-subtitle">Load or manage your networks</p>
          </div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* Save form */}
        <div className="drawer-section">
          <p className="drawer-section-label">SAVE CURRENT TOPOLOGY</p>
          <form className="drawer-save-form" onSubmit={handleSave}>
            <input
              className="drawer-input"
              placeholder="Topology name…"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              maxLength={64}
            />
            <button className="drawer-save-btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>

        <div className="drawer-divider" />

        {/* List */}
        <div className="drawer-section drawer-list-section">
          <p className="drawer-section-label">YOUR TOPOLOGIES</p>

          {loading ? (
            <div className="drawer-loading">
              <div className="boot-spinner" style={{ width: 24, height: 24 }} />
              <span>Loading…</span>
            </div>
          ) : topologies.length === 0 ? (
            <p className="drawer-empty">No saved topologies yet.</p>
          ) : (
            <ul className="drawer-list">
              {topologies.map((t) => (
                <li key={t._id} className="drawer-item">
                  <div className="drawer-item-info">
                    <span className="drawer-item-name">{t.name}</span>
                    <span className="drawer-item-date">{formatDate(t.createdAt)}</span>
                  </div>
                  <div className="drawer-item-actions">
                    <button
                      className="drawer-action-btn btn-load"
                      onClick={() => setConfirmLoad(t)}
                      title="Load this topology"
                    >
                      Load
                    </button>
                    <button
                      className="drawer-action-btn btn-del"
                      onClick={() => setConfirmDelete(t._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Confirm Load */}
      {confirmLoad && (
        <ConfirmModal
          title="Load Topology"
          message={`Replace the current canvas with "${confirmLoad.name}"? This cannot be undone.`}
          confirmLabel="Load"
          onConfirm={handleLoadConfirmed}
          onCancel={() => setConfirmLoad(null)}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Topology"
          message="Are you sure you want to delete this topology? This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}