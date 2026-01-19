const textEncoder = new TextEncoder()

const toBase64Url = (buffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

export const createRandomToken = (size = 32) => {
  const bytes = new Uint8Array(size)
  window.crypto.getRandomValues(bytes)
  return toBase64Url(bytes)
}

export const hashToken = async (token) => {
  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    textEncoder.encode(token)
  )
  return toBase64Url(digest)
}

export const createSalt = () => createRandomToken(16)

// NOTE: Browser-only MVP uses PBKDF2. Production should use bcrypt or Argon2.
export const hashPassword = async (password, salt, iterations = 120000) => {
  const key = await window.crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: textEncoder.encode(salt),
      iterations,
    },
    key,
    256
  )
  return toBase64Url(derivedBits)
}

export const getUserAgent = () =>
  typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent

export const getClientIp = () => 'unknown'

export const getNowIso = () => new Date().toISOString()

export const isExpired = (isoString) => new Date(isoString).getTime() <= Date.now()
