import { create } from "zustand";

const TOKEN_KEY = "ospfvis_token";
const USER_KEY  = "ospfvis_user";

function loadFromStorage() {
  try {
    return {
      token: localStorage.getItem(TOKEN_KEY) || null,
      user:  JSON.parse(localStorage.getItem(USER_KEY) || "null"),
    };
  } catch {
    return { token: null, user: null };
  }
}

const { token: savedToken, user: savedUser } = loadFromStorage();

export const useAuthStore = create((set) => ({
  token: savedToken,
  user:  savedUser,
  guest: false,   // true when user chose "Continue without account"

  setGuest: (val) => set({ guest: val }),

  login: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, guest: false });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Go back to auth page on logout
    set({ token: null, user: null, guest: false });
  },
}));