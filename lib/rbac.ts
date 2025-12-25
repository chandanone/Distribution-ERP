export function requireRole(roleId: number, userRoleId: number | null) {
  if (userRoleId !== roleId) {
    throw new Error("Unauthorized");
  }
}
