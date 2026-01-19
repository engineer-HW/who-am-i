const AUTH_STORAGE_KEY = 'who-am-i-auth-v1'

const defaultState = {
  users: [],
  refreshTokens: [],
  passwordResets: [],
  loginAttempts: {},
  auditLogs: [],
}

export const loadAuthState = () => {
  if (typeof window === 'undefined') {
    return { ...defaultState }
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return { ...defaultState }
  }

  try {
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return { ...defaultState }
  }
}

export const saveAuthState = (nextState) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
}

export const resetAuthState = () => {
  saveAuthState({ ...defaultState })
}

export const getDefaultAuthState = () => ({ ...defaultState })
