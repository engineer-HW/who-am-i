import { loadAuthState, saveAuthState } from './authStorage'
import {
  createRandomToken,
  createSalt,
  getClientIp,
  getNowIso,
  getUserAgent,
  hashPassword,
  hashToken,
  isExpired,
} from './authUtils'

const ACCESS_TOKEN_TTL_MS = 30 * 60 * 1000
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000
const LOGIN_ATTEMPT_WINDOW_MS = 10 * 60 * 1000
const LOGIN_ATTEMPT_MAX = 5
const LOGIN_LOCK_MS = 15 * 60 * 1000

const REFRESH_COOKIE = 'whoami_refresh'

let currentSession = null

const getCookie = (name) => {
  if (typeof document === 'undefined') {
    return ''
  }

  const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  if (!match) {
    return ''
  }
  return decodeURIComponent(match.split('=').slice(1).join('='))
}

const setCookie = (name, value, maxAgeSeconds) => {
  if (typeof document === 'undefined') {
    return
  }

  const attributes = [
    `Path=/`,
    `SameSite=Lax`,
    `Secure`,
  ]

  if (maxAgeSeconds) {
    attributes.push(`Max-Age=${maxAgeSeconds}`)
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; ${attributes.join(
    '; '
  )}`
}

const clearCookie = (name) => {
  if (typeof document === 'undefined') {
    return
  }
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`
}

const normalizeEmail = (email) => email.trim().toLowerCase()

const createAuditLog = (entry) => ({
  id: createRandomToken(8),
  createdAt: getNowIso(),
  ...entry,
})

const updateLoginAttempts = (state, email, success) => {
  const now = Date.now()
  const current = state.loginAttempts[email] || {
    count: 0,
    firstFailedAt: now,
    lockedUntil: 0,
    requiresCaptcha: false,
  }

  if (success) {
    state.loginAttempts[email] = {
      count: 0,
      firstFailedAt: now,
      lockedUntil: 0,
      requiresCaptcha: false,
    }
    return
  }

  const windowStart = current.firstFailedAt
  const withinWindow = now - windowStart <= LOGIN_ATTEMPT_WINDOW_MS
  const nextCount = withinWindow ? current.count + 1 : 1
  const nextFirstFailedAt = withinWindow ? current.firstFailedAt : now
  const lockedUntil =
    nextCount >= LOGIN_ATTEMPT_MAX ? now + LOGIN_LOCK_MS : current.lockedUntil
  const requiresCaptcha = nextCount >= LOGIN_ATTEMPT_MAX

  state.loginAttempts[email] = {
    count: nextCount,
    firstFailedAt: nextFirstFailedAt,
    lockedUntil,
    requiresCaptcha,
  }
}

const isLoginLocked = (state, email) => {
  const attempt = state.loginAttempts[email]
  return Boolean(attempt && attempt.lockedUntil > Date.now())
}

const isCaptchaRequired = (state, email) => {
  const attempt = state.loginAttempts[email]
  return Boolean(attempt && attempt.requiresCaptcha)
}

const storeRefreshToken = async (state, userId, token, rememberMe) => {
  const tokenHash = await hashToken(token)
  const now = Date.now()
  const expiresAt = new Date(
    rememberMe ? now + REFRESH_TOKEN_TTL_MS : now + ACCESS_TOKEN_TTL_MS
  ).toISOString()

  state.refreshTokens.push({
    id: createRandomToken(8),
    userId,
    tokenHash,
    createdAt: getNowIso(),
    expiresAt,
    revokedAt: null,
    rememberMe,
    userAgent: getUserAgent(),
    ip: getClientIp(),
  })
}

const revokeRefreshToken = (state, tokenHash) => {
  const target = state.refreshTokens.find((item) => item.tokenHash === tokenHash)
  if (target && !target.revokedAt) {
    target.revokedAt = getNowIso()
  }
}

const revokeAllUserTokens = (state, userId) => {
  state.refreshTokens = state.refreshTokens.map((token) =>
    token.userId === userId ? { ...token, revokedAt: getNowIso() } : token
  )
}

const setCurrentSession = (user) => {
  currentSession = {
    user,
    accessToken: createRandomToken(16),
    expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
  }
  return currentSession
}

const isSessionValid = (session) =>
  session && !isExpired(session.expiresAt)

export const getCurrentUser = () =>
  isSessionValid(currentSession) ? currentSession.user : null

export const signUpUser = async ({ email, password }) => {
  const state = loadAuthState()
  const normalized = normalizeEmail(email)
  const existing = state.users.find((user) => user.email === normalized)
  if (existing) {
    throw new Error('すでに登録済みのメールアドレスです。')
  }

  const salt = createSalt()
  const passwordHash = await hashPassword(password, salt)
  const now = getNowIso()

  const nextUser = {
    id: createRandomToken(10),
    email: normalized,
    passwordHash,
    passwordSalt: salt,
    passwordUpdatedAt: now,
    role: 'user',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  state.users.push(nextUser)
  state.auditLogs.push(
    createAuditLog({
      type: 'signup',
      userId: nextUser.id,
      email: normalized,
      success: true,
      ip: getClientIp(),
      userAgent: getUserAgent(),
    })
  )

  const refreshToken = createRandomToken(32)
  await storeRefreshToken(state, nextUser.id, refreshToken, false)
  setCookie(REFRESH_COOKIE, refreshToken, Math.floor(ACCESS_TOKEN_TTL_MS / 1000))
  saveAuthState(state)

  const session = setCurrentSession({
    id: nextUser.id,
    email: normalized,
    role: nextUser.role,
  })
  return session.user
}

export const loginUser = async ({
  email,
  password,
  rememberMe = false,
  captchaToken = '',
}) => {
  const state = loadAuthState()
  const normalized = normalizeEmail(email)

  if (isLoginLocked(state, normalized)) {
    throw new Error('ログイン試行が多すぎます。時間をおいて再試行してください。')
  }

  if (isCaptchaRequired(state, normalized) && !captchaToken) {
    throw new Error('追加の確認が必要です。')
  }

  const user = state.users.find((item) => item.email === normalized)
  const passwordHash = user
    ? await hashPassword(password, user.passwordSalt)
    : ''

  if (!user || user.passwordHash !== passwordHash) {
    updateLoginAttempts(state, normalized, false)
    state.auditLogs.push(
      createAuditLog({
        type: 'login',
        userId: user?.id || null,
        email: normalized,
        success: false,
        ip: getClientIp(),
        userAgent: getUserAgent(),
      })
    )
    saveAuthState(state)
    throw new Error('メールアドレスまたはパスワードが違います。')
  }

  if (user.status !== 'active') {
    throw new Error('アカウントが無効化されています。')
  }

  updateLoginAttempts(state, normalized, true)
  state.auditLogs.push(
    createAuditLog({
      type: 'login',
      userId: user.id,
      email: normalized,
      success: true,
      ip: getClientIp(),
      userAgent: getUserAgent(),
    })
  )

  const refreshToken = createRandomToken(32)
  await storeRefreshToken(state, user.id, refreshToken, rememberMe)
  saveAuthState(state)

  const cookieLifetimeSeconds = rememberMe
    ? Math.floor(REFRESH_TOKEN_TTL_MS / 1000)
    : Math.floor(ACCESS_TOKEN_TTL_MS / 1000)
  setCookie(REFRESH_COOKIE, refreshToken, cookieLifetimeSeconds)

  const session = setCurrentSession({
    id: user.id,
    email: user.email,
    role: user.role,
  })
  return session.user
}

export const refreshSession = async () => {
  const refreshToken = getCookie(REFRESH_COOKIE)
  if (!refreshToken) {
    return null
  }

  const state = loadAuthState()
  const tokenHash = await hashToken(refreshToken)
  const stored = state.refreshTokens.find((token) => token.tokenHash === tokenHash)

  if (!stored || stored.revokedAt || isExpired(stored.expiresAt)) {
    revokeRefreshToken(state, tokenHash)
    saveAuthState(state)
    clearCookie(REFRESH_COOKIE)
    return null
  }

  const user = state.users.find((item) => item.id === stored.userId)
  if (!user) {
    clearCookie(REFRESH_COOKIE)
    return null
  }

  revokeRefreshToken(state, tokenHash)
  const rotatedRefreshToken = createRandomToken(32)
  await storeRefreshToken(state, user.id, rotatedRefreshToken, stored.rememberMe)
  saveAuthState(state)
  const rotatedLifetimeMs = stored.rememberMe
    ? REFRESH_TOKEN_TTL_MS
    : ACCESS_TOKEN_TTL_MS
  setCookie(
    REFRESH_COOKIE,
    rotatedRefreshToken,
    Math.floor(rotatedLifetimeMs / 1000)
  )

  const session = setCurrentSession({
    id: user.id,
    email: user.email,
    role: user.role,
  })
  return session.user
}

export const logoutUser = async () => {
  const refreshToken = getCookie(REFRESH_COOKIE)
  if (!refreshToken) {
    currentSession = null
    return
  }

  const state = loadAuthState()
  const tokenHash = await hashToken(refreshToken)
  revokeRefreshToken(state, tokenHash)
  state.auditLogs.push(
    createAuditLog({
      type: 'logout',
      userId: currentSession?.user?.id || null,
      email: currentSession?.user?.email || '',
      success: true,
      ip: getClientIp(),
      userAgent: getUserAgent(),
    })
  )
  saveAuthState(state)

  clearCookie(REFRESH_COOKIE)
  currentSession = null
}

export const requestPasswordReset = async ({ email }) => {
  const state = loadAuthState()
  const normalized = normalizeEmail(email)
  const user = state.users.find((item) => item.email === normalized)

  const resetToken = createRandomToken(32)
  if (user) {
    const tokenHash = await hashToken(resetToken)
    state.passwordResets.push({
      id: createRandomToken(8),
      userId: user.id,
      tokenHash,
      createdAt: getNowIso(),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString(),
      usedAt: null,
    })
    state.auditLogs.push(
      createAuditLog({
        type: 'password_reset_request',
        userId: user.id,
        email: normalized,
        success: true,
        ip: getClientIp(),
        userAgent: getUserAgent(),
      })
    )
    saveAuthState(state)
  }

  return {
    ok: true,
    devToken: user ? resetToken : '',
  }
}

export const resetPassword = async ({ token, password }) => {
  const state = loadAuthState()
  const tokenHash = await hashToken(token)
  const resetEntry = state.passwordResets.find(
    (item) => item.tokenHash === tokenHash
  )

  if (!resetEntry || resetEntry.usedAt || isExpired(resetEntry.expiresAt)) {
    throw new Error('リセット用トークンが無効または期限切れです。')
  }

  const user = state.users.find((item) => item.id === resetEntry.userId)
  if (!user) {
    throw new Error('リセットに失敗しました。')
  }

  const salt = createSalt()
  const passwordHash = await hashPassword(password, salt)
  const now = getNowIso()

  user.passwordHash = passwordHash
  user.passwordSalt = salt
  user.passwordUpdatedAt = now
  user.updatedAt = now

  resetEntry.usedAt = now
  revokeAllUserTokens(state, user.id)

  if (currentSession?.user?.id === user.id) {
    currentSession = null
  }

  state.auditLogs.push(
    createAuditLog({
      type: 'password_reset_complete',
      userId: user.id,
      email: user.email,
      success: true,
      ip: getClientIp(),
      userAgent: getUserAgent(),
    })
  )

  saveAuthState(state)
  clearCookie(REFRESH_COOKIE)
  return { ok: true }
}

export const getAuthAuditLogs = () => loadAuthState().auditLogs

export const getLoginRiskStatus = (email) => {
  const state = loadAuthState()
  const normalized = normalizeEmail(email || '')
  const attempt = state.loginAttempts[normalized]
  return {
    locked: isLoginLocked(state, normalized),
    requiresCaptcha: isCaptchaRequired(state, normalized),
    remainingLockMs: attempt?.lockedUntil
      ? Math.max(0, attempt.lockedUntil - Date.now())
      : 0,
  }
}
