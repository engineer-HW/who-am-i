const profile = {
  id: 'hikapon1007',
  name: 'ひかる',
  mbti: 'INFP(仲介者)',
  note: '週末はフィルムカメラを持って散歩してます。',
}

const snsLinks = []

const pocketSections = [
  {
    title: '本・マンガ',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 4h10a2 2 0 0 1 2 2v12.5a1.5 1.5 0 0 0-1.5-1.5H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 4v12.5a1.5 1.5 0 0 0-1.5-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    visibility: '相互公開',
    tags: ['三体', '村上春樹', 'ハイキュー!!'],
  },
  {
    title: 'ゲーム',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 11h4M11 9v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="16.5" cy="11" r="1" fill="currentColor" />
        <circle cx="18.5" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
    visibility: '相互公開',
    tags: ['APEX', '人狼', '山手線ゲーム'],
  },
  {
    title: '習慣・趣味',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="5"
          y="4"
          width="14"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 9h8M8 13h8M8 17h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    visibility: '相互公開',
    tags: ['サウナ', 'ランニング', 'プログラミング'],
  },
  {
    title: '価値観',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20s-6-4.1-6-9a4 4 0 0 1 7-2.6A4 4 0 0 1 18 11c0 4.9-6 9-6 9Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    visibility: '自分のみ',
    tags: ['誠実さ', '1人が好き', 'ポジティブ'],
  },
]

const Dashboard = () => (
  <div className="mypage-app">
    <header className="mypage-header">
      <h1>マイページ</h1>
      <button className="icon-button" type="button" aria-label="設定">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 8.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3.7a7.1 7.1 0 0 0-1.7-1l-.3-2.4h-4l-.3 2.4a7.1 7.1 0 0 0-1.7 1L5.1 5.9l-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-.7a7.1 7.1 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.1 7.1 0 0 0 1.7-1l2.3.7 2-3.5-2-1.5a7 7 0 0 0 .1-1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>

    <section className="profile-card">
      <div className="profile-main">
        <div className="profile-photo">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="3"
              y="6"
              width="18"
              height="14"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="13"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 6l1.5-2h5L16 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <dl className="profile-info">
          <div>
            <dt>ID:</dt>
            <dd>{profile.id}</dd>
          </div>
          <div>
            <dt>Name:</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>MBTI:</dt>
            <dd>{profile.mbti}</dd>
          </div>
        </dl>
      </div>
      <div className="profile-note">
        <p>ひとこと</p>
        <div className="note-box">{profile.note}</div>
      </div>
      {snsLinks.length > 0 && (
        <div className="sns-row">
          {snsLinks.map((sns) => (
            <a key={sns.name} href={sns.url} aria-label={sns.name}>
              {sns.icon}
            </a>
          ))}
        </div>
      )}
    </section>

    <section className="pocket-card">
      <header className="pocket-header">
        <div>
          <h2>わたしのポケット</h2>
          <p>共通の「好き」が見つかる場所</p>
        </div>
        <button className="pocket-edit" type="button">
          編集する
        </button>
      </header>

      <div className="pocket-list">
        {pocketSections.map((section) => (
          <div key={section.title} className="pocket-item">
            <div className="pocket-title">
              <span className="pocket-icon">{section.icon}</span>
              <h3>{section.title}</h3>
            </div>
            <span
              className={`visibility-chip${
                section.visibility === '自分のみ' ? ' is-private' : ''
              }`}
            >
              {section.visibility}
            </span>
            <div className="tag-row">
              {section.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
              <button type="button" className="tag-add" aria-label="追加">
                ＋
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    <nav className="bottom-nav" aria-label="グローバルナビゲーション">
      <button type="button" className="nav-item is-active">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5 20a7 7 0 0 1 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span>マイページ</span>
      </button>
      <button type="button" className="nav-center" aria-label="交換">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      </button>
      <button type="button" className="nav-item">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 8a3 3 0 1 1 3 3H7a3 3 0 1 1 0-6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M17 17a3 3 0 1 1 0-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 11h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>つながり</span>
      </button>
    </nav>
  </div>
)

export default Dashboard
