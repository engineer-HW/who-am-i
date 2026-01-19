import { mockFriend } from '../data/mockProfile'
import {
  getCurrentUser,
  getLoginRiskStatus,
  loginUser as loginWithPassword,
  logoutUser as logoutSession,
  refreshSession,
  requestPasswordReset,
  resetPassword,
  signUpUser as registerUser,
} from './authService'
import { isSupabaseEnabled, supabase } from './supabaseClient'

const STORAGE_KEY = 'who-am-i-mvp'

const emptySnapshot = {
  profile: {
    favoriteId: '',
    nickname: '',
    mbti: '',
    bio: '',
  },
  dictionary: {
    reading: [],
    habits: [],
    games: [],
    values: [],
  },
  socials: {
    x: '',
    instagram: '',
    youtube: '',
  },
  shareUrl: '',
  friendConnection: {
    status: 'idle',
    friendUrl: '',
  },
}

const loadSnapshot = () => {
  if (typeof window === 'undefined') {
    return { ...emptySnapshot }
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { ...emptySnapshot }
  }

  try {
    return { ...emptySnapshot, ...JSON.parse(stored) }
  } catch {
    return { ...emptySnapshot }
  }
}

const saveSnapshot = (next) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export const getLocalSnapshot = () => loadSnapshot()

export const loginUser = async (payload) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    if (error) {
      throw error
    }
    return { id: data.user.id, email: data.user.email, role: 'user' }
  }

  return loginWithPassword(payload)
}

export const signUpUser = async ({ email, password }) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      throw error
    }
    return { id: data.user.id, email: data.user.email, role: 'user' }
  }

  return registerUser({ email, password })
}

export const logoutUser = async () => {
  if (isSupabaseEnabled) {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  await logoutSession()
}

export const restoreSession = async () => {
  if (isSupabaseEnabled) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user ? { id: user.id, email: user.email, role: 'user' } : null
  }

  const refreshed = await refreshSession()
  return refreshed || getCurrentUser()
}

export const sendPasswordReset = async (payload) => {
  if (isSupabaseEnabled) {
    const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
      redirectTo: payload.redirectTo,
    })
    if (error) {
      throw error
    }
    return { ok: true }
  }

  return requestPasswordReset(payload)
}

export const updatePassword = async (payload) => {
  if (isSupabaseEnabled) {
    const { error } = await supabase.auth.updateUser({
      password: payload.password,
    })
    if (error) {
      throw error
    }
    return { ok: true }
  }

  return resetPassword(payload)
}

export const getLoginRisk = (email) => {
  if (isSupabaseEnabled) {
    return { locked: false, requiresCaptcha: false, remainingLockMs: 0 }
  }

  return getLoginRiskStatus(email)
}

export const saveProfile = async (userId, profile) => {
  const snapshot = loadSnapshot()
  const next = { ...snapshot, profile }
  saveSnapshot(next)

  if (isSupabaseEnabled) {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      favorite_id: profile.favoriteId,
      nickname: profile.nickname,
      mbti: profile.mbti,
      bio: profile.bio,
    })
    if (error) {
      throw error
    }
  }

  return profile
}

export const saveDictionary = async (userId, dictionary) => {
  const snapshot = loadSnapshot()
  const next = { ...snapshot, dictionary }
  saveSnapshot(next)

  if (isSupabaseEnabled) {
    const { error } = await supabase.from('dictionaries').upsert({
      id: userId,
      reading: dictionary.reading,
      habits: dictionary.habits,
      games: dictionary.games,
      values: dictionary.values,
    })
    if (error) {
      throw error
    }
  }

  return dictionary
}

export const saveSocialLinks = async (userId, socials) => {
  const snapshot = loadSnapshot()
  const next = { ...snapshot, socials }
  saveSnapshot(next)

  if (isSupabaseEnabled) {
    const { error } = await supabase.from('social_links').upsert({
      id: userId,
      x_url: socials.x,
      instagram_url: socials.instagram,
      youtube_url: socials.youtube,
    })
    if (error) {
      throw error
    }
  }

  return socials
}

export const createShareUrl = async (userId, favoriteId) => {
  const snapshot = loadSnapshot()
  const shareUrl = `https://who-am-i.local/${favoriteId || userId}`
  const next = { ...snapshot, shareUrl }
  saveSnapshot(next)

  if (isSupabaseEnabled) {
    const { error } = await supabase.from('share_urls').upsert({
      id: userId,
      share_url: shareUrl,
    })
    if (error) {
      throw error
    }
  }

  return shareUrl
}

export const requestFriendConnection = async (friendUrl) => {
  const snapshot = loadSnapshot()
  const next = {
    ...snapshot,
    friendConnection: {
      status: 'pending',
      friendUrl,
    },
  }
  saveSnapshot(next)

  return next.friendConnection
}

export const approveFriendConnection = async () => {
  const snapshot = loadSnapshot()
  const next = {
    ...snapshot,
    friendConnection: {
      ...snapshot.friendConnection,
      status: 'approved',
    },
  }
  saveSnapshot(next)

  return {
    status: next.friendConnection.status,
    friend: mockFriend,
  }
}
