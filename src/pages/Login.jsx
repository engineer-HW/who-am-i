import { useEffect, useState } from 'react'
import { getLoginRisk } from '../lib/api'

const Login = ({
  onLogin,
  onSignup,
  onPasswordResetRequest,
  onPasswordReset,
  loading,
  errorMessage,
  resetInfo,
}) => {
  const [mode, setMode] = useState('login')
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    rememberMe: false,
    resetToken: '',
    newPassword: '',
    captchaToken: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loginRisk, setLoginRisk] = useState({
    locked: false,
    requiresCaptcha: false,
    remainingLockMs: 0,
  })

  useEffect(() => {
    if (mode !== 'login') {
      return
    }
    setLoginRisk(getLoginRisk(formState.email))
  }, [formState.email, mode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (mode === 'login') {
      onLogin(formState)
      return
    }
    if (mode === 'signup') {
      onSignup(formState)
      return
    }
    if (mode === 'resetRequest') {
      onPasswordResetRequest({ email: formState.email })
      return
    }
    onPasswordReset({
      token: formState.resetToken,
      password: formState.newPassword,
    })
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
            <h2>
              {mode === 'login'
                ? 'ログイン'
                : mode === 'signup'
                ? '新規登録'
                : mode === 'resetRequest'
                ? 'パスワードリセット'
                : 'パスワード更新'}
            </h2>
            <p className="subtext">
              {mode === 'login'
                ? '続けるにはアカウント情報を入力してください。'
                : mode === 'signup'
                ? 'はじめての方はメールとパスワードで登録できます。'
                : mode === 'resetRequest'
                ? '登録済みのメールアドレスへリセット案内を送信します。'
                : '届いたトークンと新しいパスワードを入力してください。'}
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

          {mode === 'login' || mode === 'signup' ? (
            <label>
              パスワード
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="8文字以上"
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? '非表示' : '表示'}
                </button>
              </div>
            </label>
          ) : null}

          {mode === 'login' ? (
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formState.rememberMe}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    rememberMe: event.target.checked,
                  }))
                }
              />
              次回から自動ログイン
            </label>
          ) : null}

          {mode === 'login' && loginRisk.requiresCaptcha ? (
            <label>
              追加の確認コード
              <input
                type="text"
                name="captchaToken"
                value={formState.captchaToken}
                onChange={handleChange}
                placeholder="CAPTCHA 連携用の入力欄"
                required
              />
            </label>
          ) : null}

          {mode === 'resetConfirm' ? (
            <>
              <label>
                リセット用トークン
                <input
                  type="text"
                  name="resetToken"
                  value={formState.resetToken}
                  onChange={handleChange}
                  placeholder="メールで届いたトークン"
                  required
                />
              </label>
              <label>
                新しいパスワード
                <div className="password-field">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formState.newPassword}
                    onChange={handleChange}
                    placeholder="8文字以上"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? '非表示' : '表示'}
                  </button>
                </div>
              </label>
            </>
          ) : null}

          {errorMessage ? (
            <p className="alert" role="alert" aria-live="assertive">
              {errorMessage}
            </p>
          ) : null}

          {mode === 'login' && loginRisk.locked ? (
            <p className="alert" role="alert" aria-live="polite">
              ログイン試行が多いため一時的にロック中です。
            </p>
          ) : null}

          {mode === 'resetRequest' && resetInfo?.ok ? (
            <div className="hint-box" role="status">
              リセット用の案内を送信しました。メールを確認してください。
              {resetInfo?.devToken ? (
                <span className="dev-note">
                  開発用トークン: {resetInfo.devToken}
                </span>
              ) : null}
            </div>
          ) : null}

          <button type="submit" disabled={loading}>
            {mode === 'login'
              ? 'ログインする'
              : mode === 'signup'
              ? '登録して始める'
              : mode === 'resetRequest'
              ? 'リセットメールを送る'
              : 'パスワードを更新'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              setMode((prev) => {
                if (prev === 'login') return 'signup'
                return 'login'
              })
            }
            disabled={loading}
          >
            {mode === 'login' ? '新規登録に切り替える' : 'ログインに戻る'}
          </button>
          {mode === 'login' ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setMode('resetRequest')}
              disabled={loading}
            >
              パスワードを忘れた方
            </button>
          ) : null}
          {mode === 'resetRequest' ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setMode('resetConfirm')}
              disabled={loading}
            >
              トークンを入力して更新する
            </button>
          ) : null}
          {mode === 'resetConfirm' ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setMode('resetRequest')}
              disabled={loading}
            >
              リセット申請に戻る
            </button>
          ) : null}
          <p className="hint">Supabase未接続の場合はローカル保存で進行します。</p>
        </form>
      </section>
    </div>
  )
}

export default Login
