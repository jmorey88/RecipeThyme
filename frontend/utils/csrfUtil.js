export function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  // console.log("csrfUtil file meta:", meta);
  return meta ? meta.getAttribute("content") : "";
}

export function setCsrfToken(token) {
  document
    .querySelector('meta[name="csrf-token"]')
    .setAttribute("content", token);
}

export async function fetchWithCsrf(url, options = {}) {
  const token = getCsrfToken();
  // console.log("fetchWithCsrf token:", token);
  const headers = {
    "Content-Type": "application/json",
    "X-CSRF-Token": token,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const newCsrfToken = response.headers.get("X-CSRF-Token");
  if (newCsrfToken) {
    setCsrfToken(newCsrfToken);
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Network response was not ok.");
  }

  return response;
}
