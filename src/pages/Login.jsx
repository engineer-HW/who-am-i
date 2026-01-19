import { useState } from 'react'

const Login = ({ onLogin, onSignup, loading, errorMessage }) => {
  const [mode, setMode] = useState('login')
  const [formState, setFormState] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const action = mode === 'login' ? onLogin : onSignup
    action(formState)
  }

  return (
    <div className="app auth-layout">
      <header className="auth-hero">
        <p className="eyebrow">Welcome</p>
        <h1>who-am-i にログイン</h1>
        <p className="subtext">
          あなたの好きなものや価値観をまとめて、友だちと共通点を見つける準備を
          始めましょう。
        </p>
        <ul className="auth-points">
          <li>プロフィールと辞書をワンステップで保存</li>
          <li>共有URLをすぐに発行してつながりへ</li>
          <li>ローカル保存でも試せるシンプル設計</li>
        </ul>
      </header>

      <section className="section auth-card">
        <div className="auth-card-header">
          <div>
            <h2>{mode === 'login' ? 'ログイン' : '新規登録'}</h2>
            <p className="subtext">
              {mode === 'login'
                ? '続けるにはアカウント情報を入力してください。'
                : 'はじめての方はメールとパスワードで登録できます。'}
            </p>
          </div>
          <span className="status-badge">
            {loading ? '接続中' : 'Ready'}
          </span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            メールアドレス
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            パスワード
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="8文字以上"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={8}
              required
            />
          </label>

          {errorMessage ? <p className="alert">{errorMessage}</p> : null}

          <button type="submit" disabled={loading}>
            {mode === 'login' ? 'ログインする' : '登録して始める'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
            }
            disabled={loading}
          >
            {mode === 'login' ? '新規登録に切り替える' : 'ログインに戻る'}
          </button>
          <p className="hint">Supabase未接続の場合はローカル保存で進行します。</p>
        </form>
      </section>
    </div>
  )
}

export default Login
