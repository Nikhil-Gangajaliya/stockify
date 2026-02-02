async function apiRequest(endpoint, method = "GET", payload = null, auth = true) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${CONFIG.BASE_URL}${endpoint}`, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : null
  });

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned non-JSON response (check API route / auth)");
  }

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || "API Error");
  }

  return response;
}
