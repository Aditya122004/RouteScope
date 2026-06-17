import { create } from "zustand";

export const useNetworkStore = create((set) => ({
  // Raw state from backend
  topology: {},
  routingTables: {},
  routerStatuses: {},

  // UI state
  selectedRouter: null,
  notification: null, // { type: 'success' | 'error', message: string }
  initialLoading: true,  // true while fetching /topology on mount
  initialError: null,    // error message if /topology fetch fails

  // Apply full state from any API response
  applyState: (state) =>
    set({
      topology: state.topology || {},
      routingTables: state.routingTables || {},
      routerStatuses: state.routerStatuses || {},
    }),

  setInitialLoading: (val) => set({ initialLoading: val }),
  setInitialError: (msg) => set({ initialError: msg, initialLoading: false }),

  setSelectedRouter: (routerId) => set({ selectedRouter: routerId }),

  notify: (type, message) => {
    set({ notification: { type, message } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  clearNotification: () => set({ notification: null }),
}));