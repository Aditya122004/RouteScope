const BASE_URL = "http://localhost:5000/api/auth";

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const authApi = {
  signup: (username, email, password) =>
    request("/signup", { username, email, password }),

  login: (email, password) =>
    request("/login", { email, password }),
};