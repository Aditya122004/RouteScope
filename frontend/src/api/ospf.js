const BASE_URL = "http://localhost:5000/api/ospf";

async function request(path, method, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data.state;
}

export const ospfApi = {
  getTopology: () =>
    request("/topology", "GET"),

  addRouter: (routerId) =>
    request("/router", "POST", { routerId }),

  addLink: (source, destination, cost) =>
    request("/link", "POST", { source, destination, cost }),

  deleteLink: (source, destination) =>
    request("/link", "DELETE", { source, destination }),

  updateLinkCost: (source, destination, cost) =>
    request("/link/cost", "PUT", { source, destination, cost }),

  routerDown: (routerId) =>
    request("/router/down", "POST", { routerId }),

  routerUp: (routerId) =>
    request("/router/up", "POST", { routerId }),
};