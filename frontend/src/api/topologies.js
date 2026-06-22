const BASE_URL = "http://localhost:5000/api/topologies";

async function request(path, method, token, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const topologiesApi = {
  getAll: (token) =>
    request("", "GET", token),

  getById: (token, id) =>
    request(`/${id}`, "GET", token),

  save: (token, name, graph, routerStatuses) =>
    request("", "POST", token, { name, graph, routerStatuses }),

  delete: (token, id) =>
    request(`/${id}`, "DELETE", token),
};