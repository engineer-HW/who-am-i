const ROLE_ORDER = ['user', 'admin', 'owner']

export const hasRole = (user, requiredRole = 'user') => {
  if (!user) {
    return false
  }
  const userIndex = ROLE_ORDER.indexOf(user.role || 'user')
  const requiredIndex = ROLE_ORDER.indexOf(requiredRole)
  if (requiredIndex === -1) {
    return false
  }
  return userIndex >= requiredIndex
}

export const requireLogin = (user) => {
  if (!user) {
    return { ok: false, reason: 'unauthenticated' }
  }
  return { ok: true }
}

export const requireAdmin = (user) => {
  if (!hasRole(user, 'admin')) {
    return { ok: false, reason: 'forbidden' }
  }
  return { ok: true }
}
