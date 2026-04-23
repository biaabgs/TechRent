const ROLE_HOME = {
  admin: "/admin/dashboard",
  tecnico: "/tecnico/dashboard",
  cliente: "/cliente/dashboard",
};

const PUBLIC_PREFIXES = ["/", "/registro"];

export function isPublicPath(pathname) {
  return PUBLIC_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function hasAccess(pathname, role) {
  if (!pathname || isPublicPath(pathname)) return true;
  if (!role) return false;

  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/tecnico")) return role === "tecnico" || role === "admin";
  if (pathname.startsWith("/cliente")) return role === "cliente" || role === "admin";

  return true;
}

export function getHomeByRole(role) {
  return ROLE_HOME[role] || "/";
}
