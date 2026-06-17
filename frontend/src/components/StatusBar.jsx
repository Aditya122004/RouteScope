import { useNetworkStore } from "../store/networkStore";

export default function StatusBar() {
  const { notification, routerStatuses, clearNotification } = useNetworkStore();

  const total = Object.keys(routerStatuses).length;
  const online = Object.values(routerStatuses).filter(Boolean).length;
  const offline = total - online;

  return (
    <div className="status-bar">
      {/* Left: live notification */}
      <div className="status-left">
        {notification ? (
          <div
            className={`status-notif ${notification.type === "error" ? "notif-error" : "notif-success"}`}
            onClick={clearNotification}
          >
            <span className="notif-icon">
              {notification.type === "error" ? "⚠" : "✓"}
            </span>
            {notification.message}
          </div>
        ) : (
          <span className="status-idle">
            <span className="idle-dot" />
            System nominal
          </span>
        )}
      </div>

      {/* Right: network health */}
      <div className="status-right">
        <span className="status-chip chip-green">
          <span className="chip-dot" /> {online} online
        </span>
        {offline > 0 && (
          <span className="status-chip chip-red">
            <span className="chip-dot chip-dot-red" /> {offline} offline
          </span>
        )}
        <span className="status-sep">|</span>
        <span className="status-hint">Click node for routes · Click edge cost to edit</span>
      </div>
    </div>
  );
}