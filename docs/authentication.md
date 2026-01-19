# ログイン機能 設計・実装メモ

本ドキュメントは「実務で後悔しないログイン機能」を目的に、設計と実装の方針を整理したものです。**MVP向け（ローカル実装）**と**本番想定（サーバー実装）**の差分も併記しています。

---

## 1. 認証フロー（文章ベース）

### 1-1. ログイン（セッション + トークン併用）
1. ユーザーがメール/パスワードでログイン。
2. サーバーがパスワード検証（bcrypt / Argon2）と、失敗回数・ロック状態をチェック。
3. 成功時に**アクセストークン（15分〜1時間）**を発行。
4. **Refresh Token（長期）**を HttpOnly Cookie で発行。
5. クライアントはアクセストークンをメモリ保持。期限切れ時は Refresh Token で再発行。

### 1-2. 自動ログイン（Refresh）
1. 初回ロード時に Refresh Token を利用してアクセストークンを再発行。
2. Refresh Token はローテーションし、旧トークンを無効化。

### 1-3. パスワードリセット
1. リセット申請（メールアドレス入力）。
2. ワンタイムトークン（有効期限あり）を発行・メール送信。
3. トークン検証後、新パスワードを登録。
4. 既存のセッション/トークンを全無効化。

---

## 2. API / ルート設計（例）

### 認証系
- `POST /auth/login`
  - body: `{ email, password, rememberMe, captchaToken }`
  - 200: `{ user, accessToken, expiresAt }`
  - 401: `{ message: "メールアドレスまたはパスワードが違います" }`
- `POST /auth/signup`
  - body: `{ email, password }`
- `POST /auth/refresh`
  - HttpOnly Cookie の Refresh Token で再発行
- `POST /auth/logout`
  - Refresh Token 無効化
- `POST /auth/password/forgot`
  - body: `{ email }`
- `POST /auth/password/reset`
  - body: `{ token, password }`

### 認可系
- `GET /me` （requireLogin）
- `GET /admin` （requireAdmin）

---

## 3. データモデル例

### users
- id
- email
- password_hash
- password_salt
- role: `user | admin | owner`
- status: `active | suspended`
- password_updated_at
- created_at
- updated_at

### refresh_tokens
- id
- user_id
- token_hash
- expires_at
- created_at
- revoked_at
- ip
- user_agent

### password_resets
- id
- user_id
- token_hash
- expires_at
- created_at
- used_at

### login_attempts
- email
- count
- first_failed_at
- locked_until
- requires_captcha

### audit_logs
- id
- type (login, logout, password_reset, signup, etc)
- user_id
- email
- success
- ip
- user_agent
- created_at

---

## 4. セキュリティ上の注意点まとめ
- パスワードの平文保存禁止 → bcrypt/Argon2 + ソルト必須。
- Refresh Token は HttpOnly Cookie で保存（XSS対策）。
- JWT を localStorage に保存しない。
- エラーは「メールアドレスまたはパスワードが違います」に統一。
- ブルートフォース対策として**失敗回数制限**と**ロック**を実装。
- 必要に応じて CAPTCHA を差し込みやすい設計にする。
- パスワードリセット時は全セッション無効化。

---

## 5. MVP向け簡易版 vs 本番想定版

### MVP（現状実装）
- ローカルストレージに**疑似データベース**を保持。
- トークンは **HttpOnly Cookie を模した Cookie** で保持。
- パスワードは**PBKDF2で疑似ハッシュ**（ブラウザ制限のため）。
- 監査ログ・ログイン試行制限はローカルに記録。

### 本番想定
- bcrypt / Argon2 でハッシュ。
- Refresh Token は**HttpOnly + Secure Cookie**で配布。
- Refresh Token ローテーション + 盗難検知。
- CAPTCHA 連携の実装。
- 2FA を管理画面だけ有効化できる設定。

---

## 6. OAuth/2FA 拡張方針

### OAuth
- `oauth_providers` テーブルで `provider`, `provider_user_id` を保持。
- パスワードに依存しない認証方式を追加可能にする。

### 2FA
- `two_factor_methods` を持たせて admin/owner だけ必須化。
- 発行済みセッションには 2FA 完了フラグを持つ。
