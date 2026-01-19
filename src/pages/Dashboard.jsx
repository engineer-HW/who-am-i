const Dashboard = ({ user, onLogout }) => (
  <div className="app">
    <header className="hero">
      <div>
        <p className="eyebrow">Logged in</p>
        <h1>ようこそ、{user.email}</h1>
        <p className="subtext">
          次はプロフィールと自分辞書の入力です。ログイン周りの実装が整ったので、
          画面を順次追加していきます。
        </p>
      </div>
      <button type="button" className="secondary" onClick={onLogout}>
        ログアウト
      </button>
    </header>

    <section className="section">
      <h2>次のステップ</h2>
      <div className="card">
        <p className="subtext">
          プロフィールと自分辞書の編集画面を準備したら、ログイン後に遷移できる
          ように接続します。
        </p>
      </div>
      <div className="card">
        <p className="subtext">
          Supabase接続時はメール認証も有効になります。ログイン画面のバリデーションを
          さらに強化する予定です。
        </p>
      </div>
    </section>
  </div>
)

export default Dashboard
