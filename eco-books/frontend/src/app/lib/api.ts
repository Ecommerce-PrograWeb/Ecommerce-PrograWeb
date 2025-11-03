export function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000"
  );
}


export async function jsonFetch<T>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}
