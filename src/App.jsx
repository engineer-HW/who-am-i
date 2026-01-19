import { useEffect, useState } from 'react'
import {
  loginUser,
  logoutUser,
  restoreSession,
  sendPasswordReset,
  signUpUser,
  updatePassword,
} from './lib/api'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(null)
  const [authStatus, setAuthStatus] = useState('idle')
  const [authError, setAuthError] = useState('')
  const [resetInfo, setResetInfo] = useState(null)

  useEffect(() => {
    const bootstrap = async () => {
      setAuthStatus('loading')
      const restored = await restoreSession()
      setUser(restored)
      setAuthStatus('idle')
    }
    bootstrap()
  }, [])

  const handleAuth = async (type, credentials) => {
    setAuthStatus('loading')
    setAuthError('')
    setResetInfo(null)

    try {
      const authAction = type === 'login' ? loginUser : signUpUser
      const nextUser = await authAction(credentials)
      setUser(nextUser)
      setAuthStatus('success')
    } catch (error) {
      setAuthStatus('idle')
      setAuthError(error?.message || '認証に失敗しました。')
    }
  }

  const handlePasswordResetRequest = async (payload) => {
    setAuthStatus('loading')
    setAuthError('')
    setResetInfo(null)
    try {
      const response = await sendPasswordReset(payload)
      setResetInfo(response)
      setAuthStatus('idle')
    } catch (error) {
      setAuthStatus('idle')
      setAuthError(error?.message || 'パスワードリセットに失敗しました。')
    }
  }

  const handlePasswordReset = async (payload) => {
    setAuthStatus('loading')
    setAuthError('')
    setResetInfo(null)
    try {
      await updatePassword(payload)
      setAuthStatus('idle')
    } catch (error) {
      setAuthStatus('idle')
      setAuthError(error?.message || 'パスワード更新に失敗しました。')
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    setAuthStatus('idle')
    setAuthError('')
  }

  if (!user) {
    return (
      <Login
        onLogin={(credentials) => handleAuth('login', credentials)}
        onSignup={(credentials) => handleAuth('signup', credentials)}
        onPasswordResetRequest={handlePasswordResetRequest}
        onPasswordReset={handlePasswordReset}
        loading={authStatus === 'loading'}
        errorMessage={authError}
        resetInfo={resetInfo}
      />
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App
