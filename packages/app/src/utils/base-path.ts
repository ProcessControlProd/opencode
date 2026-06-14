// URL prefix the app is hosted under behind a reverse proxy. Read from the
// <base href> injected by the server (driven by --base-path / OPENCODE_BASE_PATH).
// Returns "" (root) when absent. Used for the API server URL and the router base.
export function getBasePath() {
  if (typeof document === "undefined") return ""
  const el = document.querySelector("base")
  if (!el?.getAttribute("href")) return ""
  try {
    return new URL(el.href).pathname.replace(/\/+$/, "")
  } catch {
    return ""
  }
}

// Directories a project may be opened from, advertised by the server in a <meta>
// (OPENCODE_PROJECT_ROOTS). Empty when unrestricted.
export function getProjectRoots() {
  if (typeof document === "undefined") return []
  const content = document.querySelector('meta[name="opencode-project-roots"]')?.getAttribute("content") ?? ""
  return content
    .split(",")
    .map((root) => root.trim())
    .filter(Boolean)
}

// The router's location.pathname keeps the base (it only uses it as a match prefix),
// while the app parses and re-navigates to paths as if it lived at the root. Remove
// it wherever a path is read. No-op at the root.
export function stripBasePath(pathname: string) {
  const base = getBasePath()
  if (!base) return pathname
  if (pathname === base) return "/"
  if (pathname.startsWith(base + "/")) return pathname.slice(base.length)
  return pathname
}
