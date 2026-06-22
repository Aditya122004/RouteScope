import { useEffect } from "react";
import ControlBar from "./components/ControlBar";
import NetworkCanvas from "./components/NetworkCanvas";
import RoutingTablePanel from "./components/RoutingTablePanel";
import StatusBar from "./components/StatusBar";
import AuthPage from "./components/AuthPage";
import { ospfApi } from "./api/ospf";
import { useNetworkStore } from "./store/networkStore";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { applyState, setInitialLoading, setInitialError, initialLoading, initialError } =
    useNetworkStore();
  const { token, user, guest, setGuest } = useAuthStore();

  // Fetch topology whenever we enter the app (logged in or guest)
  const isInApp = !!token || guest;

  useEffect(() => {
    if (!isInApp) return;
    setInitialLoading(true);
    ospfApi
      .getTopology()
      .then((state) => {
        applyState(state);
        setInitialLoading(false);
      })
      .catch((err) => {
        setInitialError(err.message || "Failed to reach backend");
      });
  }, [isInApp]);

  // Not yet decided — show auth page
  if (!isInApp) {
    return <AuthPage onContinueAsGuest={() => setGuest(true)} />;
  }

  if (initialLoading) {
    return (
      <div className="app-shell">
        <div className="app-boot">
          <div className="boot-spinner" />
          <p className="boot-text">Connecting to OSPF network…</p>
        </div>
      </div>
    );
  }

  if (initialError) {
    return (
      <div className="app-shell">
        <div className="app-boot">
          <div className="boot-error-icon">⚠</div>
          <p className="boot-text boot-text-error">Cannot reach backend</p>
          <p className="boot-hint">{initialError}</p>
          <button className="boot-retry" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ControlBar />
      <div className="app-body">
        <NetworkCanvas />
        <RoutingTablePanel />
      </div>
      <StatusBar />
    </div>
  );
}