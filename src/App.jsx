import { useMemo, useState } from 'react'
import {
  approveFriendConnection,
  createShareUrl,
  getLocalSnapshot,
  loginUser,
  requestFriendConnection,
  saveDictionary,
  saveProfile,
  saveSocialLinks,
} from './lib/api'

const stepLabels = [
  'ログイン',
  'プロフィール設定',
  '自分辞書設定',
  'マイページ遷移',
  'プロフィール/辞書更新',
  'SNSリンク設定',
  'URL発行',
  'SNS一言に追加',
  'QR読み込み',
  'つながりページ',
  '共通点表示',
  '画面分割比較',
]

const formatList = (items) => items.join(', ')
const parseList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const Section = ({ title, children }) => (
  <section className="section">
    <h2>{title}</h2>
    {children}
  </section>
)

function App() {
  const snapshot = getLocalSnapshot()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(snapshot.user)
  const [profile, setProfileState] = useState(snapshot.profile)
  const [dictionary, setDictionaryState] = useState(snapshot.dictionary)
  const [socials, setSocialsState] = useState(snapshot.socials)
  const [shareUrl, setShareUrl] = useState(snapshot.shareUrl)
  const [friendConnection, setFriendConnection] = useState(
    snapshot.friendConnection,
  )
  const [friendData, setFriendData] = useState(null)
  const [loginState, setLoginState] = useState({ email: '', password: '' })
  const [profileDraft, setProfileDraft] = useState(profile)
  const [dictionaryDraft, setDictionaryDraft] = useState(dictionary)
  const [socialDraft, setSocialDraft] = useState(socials)
  const [friendUrlInput, setFriendUrlInput] = useState('')

  const commonChips = useMemo(() => {
    if (!friendData) {
      return []
    }
    const sections = ['reading', 'habits', 'games', 'values']
    const userItems = sections.flatMap((key) => dictionary[key])
    const friendItems = sections.flatMap((key) => friendData.dictionary[key])
    const friendSet = new Set(friendItems)
    const matches = userItems.filter((item) => friendSet.has(item))
    return [...new Set(matches)]
  }, [dictionary, friendData])

  const handleLogin = async (event) => {
    event.preventDefault()
    const nextUser = await loginUser(loginState)
    setUser(nextUser)
    setStep(2)
  }

  const handleProfileSave = async (event) => {
    event.preventDefault()
    await saveProfile(user.id, profileDraft)
    setProfileState(profileDraft)
    setStep(3)
  }

  const handleDictionarySave = async (event) => {
    event.preventDefault()
    await saveDictionary(user.id, dictionaryDraft)
    setDictionaryState(dictionaryDraft)
    setStep(4)
  }

  const handleProfileUpdate = async (event) => {
    event.preventDefault()
    await saveProfile(user.id, profileDraft)
    await saveDictionary(user.id, dictionaryDraft)
    setProfileState(profileDraft)
    setDictionaryState(dictionaryDraft)
    setStep(6)
  }

  const handleSocialSave = async (event) => {
    event.preventDefault()
    await saveSocialLinks(user.id, socialDraft)
    setSocialsState(socialDraft)
    setStep(7)
  }

  const handleShareUrl = async () => {
    const url = await createShareUrl(user.id, profile.favoriteId)
    setShareUrl(url)
  }

  const handleFriendRequest = async (event) => {
    event.preventDefault()
    const connection = await requestFriendConnection(friendUrlInput)
    setFriendConnection(connection)
  }

  const handleApprove = async () => {
    const result = await approveFriendConnection()
    setFriendConnection((prev) => ({ ...prev, status: result.status }))
    setFriendData(result.friend)
    setStep(10)
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">MVPユーザーフロー</p>
          <h1>who-am-i 縦切りフロー</h1>
          <p className="subtext">
            ログインから友達比較まで、1本のユーザーフローだけを順番に通過します。
          </p>
        </div>
        <div className="step-indicator">
          <span>Step {step}/12</span>
          <p>{stepLabels[step - 1]}</p>
        </div>
      </header>

      {step === 1 && (
        <Section title="1. ログイン">
          <form className="form" onSubmit={handleLogin}>
            <label>
              メールアドレス
              <input
                type="email"
                value={loginState.email}
                onChange={(event) =>
                  setLoginState((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              パスワード
              <input
                type="password"
                value={loginState.password}
                onChange={(event) =>
                  setLoginState((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                required
              />
            </label>
            <button type="submit">ログインする</button>
            <p className="hint">
              Supabase未接続の場合はローカル保存で進行します。
            </p>
          </form>
        </Section>
      )}

      {step === 2 && (
        <Section title="2. プロフィール設定">
          <form className="form" onSubmit={handleProfileSave}>
            <label>
              好きなID
              <input
                value={profileDraft.favoriteId}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    favoriteId: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              ニックネーム
              <input
                value={profileDraft.nickname}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    nickname: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              MBTI
              <input
                value={profileDraft.mbti}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    mbti: event.target.value,
                  }))
                }
                placeholder="例: ENFP"
                required
              />
            </label>
            <label>
              一言
              <textarea
                value={profileDraft.bio}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    bio: event.target.value,
                  }))
                }
                required
              />
            </label>
            <button type="submit">プロフィールを保存</button>
          </form>
        </Section>
      )}

      {step === 3 && (
        <Section title="3. 自分辞書設定">
          <form className="form" onSubmit={handleDictionarySave}>
            <label>
              読書（カンマ区切り）
              <input
                value={formatList(dictionaryDraft.reading)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    reading: parseList(event.target.value),
                  }))
                }
                placeholder="例: SF, エッセイ"
                required
              />
            </label>
            <label>
              習慣（カンマ区切り）
              <input
                value={formatList(dictionaryDraft.habits)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    habits: parseList(event.target.value),
                  }))
                }
                placeholder="例: 朝の散歩, ストレッチ"
                required
              />
            </label>
            <label>
              ゲーム（カンマ区切り）
              <input
                value={formatList(dictionaryDraft.games)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    games: parseList(event.target.value),
                  }))
                }
                placeholder="例: スプラトゥーン"
                required
              />
            </label>
            <label>
              価値観（カンマ区切り）
              <input
                value={formatList(dictionaryDraft.values)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    values: parseList(event.target.value),
                  }))
                }
                placeholder="例: 誠実さ, 好奇心"
                required
              />
            </label>
            <button type="submit">辞書を保存</button>
          </form>
        </Section>
      )}

      {step === 4 && (
        <Section title="4. マイページへ遷移">
          <div className="card">
            <h3>プロフィール</h3>
            <p>好きなID: {profile.favoriteId}</p>
            <p>ニックネーム: {profile.nickname}</p>
            <p>MBTI: {profile.mbti}</p>
            <p>一言: {profile.bio}</p>
          </div>
          <div className="card">
            <h3>自分辞書</h3>
            <p>読書: {dictionary.reading.join(' / ')}</p>
            <p>習慣: {dictionary.habits.join(' / ')}</p>
            <p>ゲーム: {dictionary.games.join(' / ')}</p>
            <p>価値観: {dictionary.values.join(' / ')}</p>
          </div>
          <button onClick={() => setStep(5)}>
            更新確認へ進む
          </button>
        </Section>
      )}

      {step === 5 && (
        <Section title="5. プロフィールと辞書を更新">
          <form className="form" onSubmit={handleProfileUpdate}>
            <label>
              好きなID
              <input
                value={profileDraft.favoriteId}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    favoriteId: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              ニックネーム
              <input
                value={profileDraft.nickname}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    nickname: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              MBTI
              <input
                value={profileDraft.mbti}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    mbti: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              一言
              <textarea
                value={profileDraft.bio}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    bio: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              読書
              <input
                value={formatList(dictionaryDraft.reading)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    reading: parseList(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              習慣
              <input
                value={formatList(dictionaryDraft.habits)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    habits: parseList(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              ゲーム
              <input
                value={formatList(dictionaryDraft.games)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    games: parseList(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              価値観
              <input
                value={formatList(dictionaryDraft.values)}
                onChange={(event) =>
                  setDictionaryDraft((prev) => ({
                    ...prev,
                    values: parseList(event.target.value),
                  }))
                }
              />
            </label>
            <button type="submit">更新を保存</button>
          </form>
        </Section>
      )}

      {step === 6 && (
        <Section title="6. SNSリンク設定">
          <form className="form" onSubmit={handleSocialSave}>
            <label>
              X
              <input
                type="url"
                value={socialDraft.x}
                onChange={(event) =>
                  setSocialDraft((prev) => ({
                    ...prev,
                    x: event.target.value,
                  }))
                }
                placeholder="https://x.com/yourid"
              />
            </label>
            <label>
              Instagram
              <input
                type="url"
                value={socialDraft.instagram}
                onChange={(event) =>
                  setSocialDraft((prev) => ({
                    ...prev,
                    instagram: event.target.value,
                  }))
                }
                placeholder="https://instagram.com/yourid"
              />
            </label>
            <label>
              YouTube
              <input
                type="url"
                value={socialDraft.youtube}
                onChange={(event) =>
                  setSocialDraft((prev) => ({
                    ...prev,
                    youtube: event.target.value,
                  }))
                }
                placeholder="https://youtube.com/yourid"
              />
            </label>
            <button type="submit">SNSリンクを保存</button>
          </form>
        </Section>
      )}

      {step === 7 && (
        <Section title="7. 自分用URLを発行">
          <div className="card">
            <p>あなた専用のURLを発行します。</p>
            <button onClick={handleShareUrl}>URLを発行</button>
            {shareUrl && (
              <div className="share-url">
                <p>発行済みURL</p>
                <a href={shareUrl} target="_blank" rel="noreferrer">
                  {shareUrl}
                </a>
              </div>
            )}
          </div>
          <button
            onClick={() => setStep(8)}
            disabled={!shareUrl}
          >
            SNSに追加へ
          </button>
        </Section>
      )}

      {step === 8 && (
        <Section title="8. SNSの一言に追加">
          <div className="card">
            <p>発行したURLをSNSの一言へ追加します。</p>
            <p>共有URL: {shareUrl}</p>
            <button onClick={() => setStep(9)}>
              追加したので次へ
            </button>
          </div>
        </Section>
      )}

      {step === 9 && (
        <Section title="9. 友達追加のためにQRを読み込む">
          <div className="qr-box">QRコード読み取りエリア</div>
          <form className="form" onSubmit={handleFriendRequest}>
            <label>
              友達のURL/コードを入力
              <input
                value={friendUrlInput}
                onChange={(event) => setFriendUrlInput(event.target.value)}
                placeholder="https://who-am-i.local/friend"
                required
              />
            </label>
            <button type="submit">読み込む</button>
          </form>
          {friendConnection.status === 'pending' && (
            <div className="card">
              <p>承認待ちです。相互承認後に相手情報を確認できます。</p>
              <button onClick={handleApprove}>相互承認する</button>
            </div>
          )}
        </Section>
      )}

      {step === 10 && friendData && (
        <Section title="10. つながりページ">
          <div className="card">
            <h3>友達プロフィール</h3>
            <p>好きなID: {friendData.profile.favoriteId}</p>
            <p>ニックネーム: {friendData.profile.nickname}</p>
            <p>MBTI: {friendData.profile.mbti}</p>
            <p>一言: {friendData.profile.bio}</p>
          </div>
          <div className="card">
            <h3>友達の自分辞書</h3>
            <p>読書: {friendData.dictionary.reading.join(' / ')}</p>
            <p>習慣: {friendData.dictionary.habits.join(' / ')}</p>
            <p>ゲーム: {friendData.dictionary.games.join(' / ')}</p>
            <p>価値観: {friendData.dictionary.values.join(' / ')}</p>
          </div>
          <div className="question">
            <p>質問: 最近ハマっていることは？</p>
          </div>
          <button onClick={() => setStep(11)}>共通点を見る</button>
        </Section>
      )}

      {step === 11 && friendData && (
        <Section title="11. 共通点表示">
          <div className="card">
            <h3>共通チップ</h3>
            {commonChips.length > 0 ? (
              <div className="chips">
                {commonChips.map((chip) => (
                  <span key={chip} className="chip">
                    {chip}
                  </span>
                ))}
              </div>
            ) : (
              <p>共通点はまだありません。</p>
            )}
          </div>
          <button onClick={() => setStep(12)}>比較画面へ</button>
        </Section>
      )}

      {step === 12 && friendData && (
        <Section title="12. 画面分割で比較">
          <div className="split">
            <div className="card">
              <h3>あなた</h3>
              <p>好きなID: {profile.favoriteId}</p>
              <p>ニックネーム: {profile.nickname}</p>
              <p>MBTI: {profile.mbti}</p>
              <p>一言: {profile.bio}</p>
              <p>読書: {dictionary.reading.join(' / ')}</p>
              <p>習慣: {dictionary.habits.join(' / ')}</p>
              <p>ゲーム: {dictionary.games.join(' / ')}</p>
              <p>価値観: {dictionary.values.join(' / ')}</p>
            </div>
            <div className="card">
              <h3>友達</h3>
              <p>好きなID: {friendData.profile.favoriteId}</p>
              <p>ニックネーム: {friendData.profile.nickname}</p>
              <p>MBTI: {friendData.profile.mbti}</p>
              <p>一言: {friendData.profile.bio}</p>
              <p>読書: {friendData.dictionary.reading.join(' / ')}</p>
              <p>習慣: {friendData.dictionary.habits.join(' / ')}</p>
              <p>ゲーム: {friendData.dictionary.games.join(' / ')}</p>
              <p>価値観: {friendData.dictionary.values.join(' / ')}</p>
            </div>
          </div>
          <p className="hint">フロー完了です。</p>
        </Section>
      )}

      {step > 1 && step < 12 && (
        <footer className="footer">
          <button
            className="secondary"
            onClick={() =>
              setStep((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            1つ前に戻る
          </button>
        </footer>
      )}
    </div>
  )
}

export default App
