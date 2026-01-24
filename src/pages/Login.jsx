import { useEffect, useState } from "react";
import { getLoginRisk } from "../lib/api";

const Login = ({
  onLogin,
  onSignup,
  onPasswordResetRequest,
  onPasswordReset,
  loading,
  errorMessage,
  resetInfo,
}) => {
  const [mode, setMode] = useState("login");
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
    resetToken: "",
    newPassword: "",
    captchaToken: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loginRisk, setLoginRisk] = useState({
    locked: false,
    requiresCaptcha: false,
    remainingLockMs: 0,
  });

  useEffect(() => {
    if (mode !== "login") {
      return;
    }
    setLoginRisk(getLoginRisk(formState.email));
  }, [formState.email, mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "login") {
      onLogin(formState);
      return;
    }
    if (mode === "signup") {
      onSignup(formState);
      return;
    }
    if (mode === "resetRequest") {
      onPasswordResetRequest({ email: formState.email });
      return;
    }
    onPasswordReset({
      token: formState.resetToken,
      password: formState.newPassword,
    });
  };

  return (
    <div className="app auth-layout">
      <header className="auth-hero">
        <h1>who-am-i</h1>
      </header>

      <section className="section auth-card">
        <div className="auth-card-header">
          <div>
            <h2>
              {mode === "login"
                ? "ログイン"
                : mode === "signup"
                ? "新規登録"
                : mode === "resetRequest"
                ? "パスワードを忘れた方"
                : "パスワード更新"}
            </h2>
            <p className="subtext">
              {mode === "login"
                ? ""
                : mode === "signup"
                ? "はじめての方はメールとパスワードで登録できます。"
                : mode === "resetRequest"
                ? "登録済みのメールアドレスを入力ください。パスワードを変更できるリンクをお送りします。"
                : "届いたトークンと新しいパスワードを入力してください。"}
            </p>
          </div>
          {/* <span className="status-badge">{loading ? "接続中" : "Ready"}</span> */}
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

          {mode === "login" || mode === "signup" ? (
            <label>
              パスワード
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="8文字以上"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "パスワードを非表示にする"
                      : "パスワードを表示する"
                  }
                  title={
                    showPassword ? "パスワードを非表示" : "パスワードを表示"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 5c5.4 0 9.8 3.6 11.4 8.6a1 1 0 0 1 0 .6C21.8 18.4 17.4 22 12 22S2.2 18.4.6 14.2a1 1 0 0 1 0-.6C2.2 8.6 6.6 5 12 5Zm0 2c-4.4 0-8 2.9-9.4 7 1.4 4.1 5 7 9.4 7s8-2.9 9.4-7c-1.4-4.1-5-7-9.4-7Zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M2.4 3.5a1 1 0 0 1 1.4 0l16.7 16.7a1 1 0 1 1-1.4 1.4l-2.3-2.3c-1.4.7-3 1.2-4.8 1.2-5.4 0-9.8-3.6-11.4-8.6a1 1 0 0 1 0-.6c.7-2 2-3.7 3.7-5L2.4 4.9a1 1 0 0 1 0-1.4Zm7 7 4.1 4.1a3 3 0 0 1-4.1-4.1Zm8.9 8.9-2.7-2.7a5 5 0 0 0-6.5-6.5L6.7 7.8a10.2 10.2 0 0 1 4.9-1.3c4.6 0 8.4 2.9 9.9 7a10.3 10.3 0 0 1-3.2 4.9Z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          ) : null}

          {mode === "login" ? (
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

          {mode === "login" && loginRisk.requiresCaptcha ? (
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

          {mode === "resetConfirm" ? (
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
                    type={showNewPassword ? "text" : "password"}
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
                    className="password-toggle"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={
                      showNewPassword
                        ? "パスワードを非表示にする"
                        : "パスワードを表示する"
                    }
                    title={
                      showNewPassword
                        ? "パスワードを非表示"
                        : "パスワードを表示"
                    }
                  >
                    {showNewPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M12 5c5.4 0 9.8 3.6 11.4 8.6a1 1 0 0 1 0 .6C21.8 18.4 17.4 22 12 22S2.2 18.4.6 14.2a1 1 0 0 1 0-.6C2.2 8.6 6.6 5 12 5Zm0 2c-4.4 0-8 2.9-9.4 7 1.4 4.1 5 7 9.4 7s8-2.9 9.4-7c-1.4-4.1-5-7-9.4-7Zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M2.4 3.5a1 1 0 0 1 1.4 0l16.7 16.7a1 1 0 1 1-1.4 1.4l-2.3-2.3c-1.4.7-3 1.2-4.8 1.2-5.4 0-9.8-3.6-11.4-8.6a1 1 0 0 1 0-.6c.7-2 2-3.7 3.7-5L2.4 4.9a1 1 0 0 1 0-1.4Zm7 7 4.1 4.1a3 3 0 0 1-4.1-4.1Zm8.9 8.9-2.7-2.7a5 5 0 0 0-6.5-6.5L6.7 7.8a10.2 10.2 0 0 1 4.9-1.3c4.6 0 8.4 2.9 9.9 7a10.3 10.3 0 0 1-3.2 4.9Z" />
                      </svg>
                    )}
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

          {mode === "login" && loginRisk.locked ? (
            <p className="alert" role="alert" aria-live="polite">
              ログイン試行が多いため一時的にロック中です。
            </p>
          ) : null}

          {mode === "resetRequest" && resetInfo?.ok ? (
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
            {mode === "login"
              ? "ログインする"
              : mode === "signup"
              ? "登録して始める"
              : mode === "resetRequest"
              ? "リセットメールを送る"
              : "パスワードを更新"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              setMode((prev) => {
                if (prev === "login") return "signup";
                return "login";
              })
            }
            disabled={loading}
          >
            {mode === "login" ? "新規登録に切り替える" : "ログインに戻る"}
          </button>
          {mode === "login" ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setMode("resetRequest")}
              disabled={loading}
            >
              パスワードを忘れた方
            </button>
          ) : null}
          {mode === "resetRequest" ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setMode("resetConfirm")}
              disabled={loading}
            >
              トークンを入力して更新する
            </button>
          ) : null}
          {mode === "resetConfirm" ? (
            <button
              type="button"
              className="ghost"
              onClick={() => setMode("resetRequest")}
              disabled={loading}
            >
              リセット申請に戻る
            </button>
          ) : null}
        </form>
      </section>
    </div>
  );
};

export default Login;
