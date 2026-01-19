import { useState } from 'react'
import { getLocalSnapshot, loginUser, logoutUser, signUpUser } from './lib/api'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {
  const snapshot = getLocalSnapshot()
  const [user, setUser] = useState(snapshot.user)
  const [authStatus, setAuthStatus] = useState('idle')
  const [authError, setAuthError] = useState('')

  const handleAuth = async (type, credentials) => {
    setAuthStatus('loading')
    setAuthError('')

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
        loading={authStatus === 'loading'}
        errorMessage={authError}
      />
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App
