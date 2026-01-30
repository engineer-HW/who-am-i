import { useEffect, useMemo, useState } from "react";

/** ---------------------------
 *  Mock Data / Constants
 *  -------------------------- */
const featuredStories = [
  {
    title: "Short Means",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Summer Escape",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Knight's Story",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Love Story",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Paradise City",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
  },
];

const photoFeed = [
  {
    id: "alps-house",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "arctic-boat",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lake-couple",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "valley-hike",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "goat-keeper",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mountain-peaks",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  },
];

const suggestionProfiles = [
  {
    name: "Johan",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
  },
  {
    name: "Mina",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  },
  {
    name: "Hugo",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
  },
];

const defaultProfileImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80";

const mbtiOptions = [
  { code: "ISTJ", label: "管理者" },
  { code: "ISFJ", label: "擁護者" },
  { code: "INFJ", label: "提唱者" },
  { code: "INTJ", label: "建築家" },
  { code: "ISTP", label: "巨匠" },
  { code: "ISFP", label: "冒険家" },
  { code: "INFP", label: "仲介者" },
  { code: "INTP", label: "論理学者" },
  { code: "ESTP", label: "起業家" },
  { code: "ESFP", label: "エンターテイナー" },
  { code: "ENFP", label: "広報運動家" },
  { code: "ENTP", label: "討論者" },
  { code: "ESTJ", label: "幹部" },
  { code: "ESFJ", label: "領事" },
  { code: "ENFJ", label: "主人公" },
  { code: "ENTJ", label: "指揮官" },
];

const GOOGLE_BOOKS_PLACEHOLDER =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80";

const CATEGORY_STORAGE_KEYS = {
  books: "book_manga_items",
  games: "game_items",
  habits: "habit_items",
};

const EDITABLE_CATEGORY_IDS = ["books", "games", "habits"];

const makeInitialCategories = () => [
  {
    id: "books",
    title: "本・漫画",
    subtitle: "最近チェックした作品。",
    type: "stories",
    actionLabel: "View all",
    items: featuredStories.map((story, index) => ({
      id: `book-${index + 1}`,
      title: story.title,
      authors: "",
      imageUrl: story.image,
      imageAuto: true,
      googleBooksId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })),
  },
  {
    id: "games",
    title: "ゲーム",
    subtitle: "気になるタイトル。",
    type: "stories",
    actionLabel: "View all",
    items: [
      {
        id: "game-1",
        title: "どうぶつの森",
        authors: "Nintendo",
        imageUrl: photoFeed[0].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "game-2",
        title: "ゼルダの伝説",
        authors: "Nintendo",
        imageUrl: photoFeed[1].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "game-3",
        title: "スプラトゥーン",
        authors: "Nintendo",
        imageUrl: photoFeed[2].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "game-4",
        title: "マリオカート",
        authors: "Nintendo",
        imageUrl: photoFeed[3].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  },
  {
    id: "habits",
    title: "習慣",
    subtitle: "続けたいルーティン。",
    type: "stories",
    actionLabel: "View all",
    items: [
      {
        id: "habit-1",
        title: "朝の散歩",
        authors: "",
        imageUrl: photoFeed[4].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "habit-2",
        title: "ストレッチ",
        authors: "",
        imageUrl: photoFeed[5].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "habit-3",
        title: "読書15分",
        authors: "",
        imageUrl: featuredStories[2].image,
        imageAuto: false,
        googleBooksId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  },
];

/** ---------------------------
 *  Helpers
 *  -------------------------- */
function reorder(list, fromId, toId) {
  const next = [...list];
  const fromIndex = next.findIndex((x) => x.id === fromId);
  const toIndex = next.findIndex((x) => x.id === toId);
  if (fromIndex === -1 || toIndex === -1) return list;
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/** ---------------------------
 *  Drag & Drop (generic)
 *  -------------------------- */
function useDndReorder() {
  // これ1つで「何をドラッグ中か」を統一管理
  const [dragState, setDragState] = useState({
    kind: null, // "category" | "item"
    source: null, // { categoryId?, id }
    over: null, // { categoryId?, id }
  });

  const clear = () => setDragState({ kind: null, source: null, over: null });

  return { dragState, setDragState, clear };
}

/** ---------------------------
 *  MBTI Input
 *  -------------------------- */
function MbtiInput({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [selectedCode, setSelectedCode] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value || "");
    setSelectedCode(value || "");
    setActiveIndex(-1);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const normalized = inputValue.trim().toLowerCase();
    return mbtiOptions.filter((option) => {
      if (!normalized) return true;
      return option.code.toLowerCase().includes(normalized);
    });
  }, [inputValue]);

  const handleInputChange = (event) => {
    const nextValue = event.target.value.toUpperCase();
    setInputValue(nextValue);
    setSelectedCode("");
    onChange(nextValue);
    setShowOptions(true);
    setActiveIndex(0);
  };

  const handleSelect = (code) => {
    setInputValue(code);
    setSelectedCode(code);
    onChange(code);
    setShowOptions(false);
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    setShowOptions(true);
    setActiveIndex(filteredOptions.length ? 0 : -1);
  };

  const handleKeyDown = (event) => {
    if (!filteredOptions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowOptions(true);
      setActiveIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowOptions(true);
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (event.key === "Enter" && showOptions) {
      const option = filteredOptions[activeIndex];
      if (option) {
        event.preventDefault();
        handleSelect(option.code);
      }
    } else if (event.key === "Escape") {
      setShowOptions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="mbti-field">
      <div className="mbti-input-row">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="例）INFJ / ENTP など"
          aria-label="MBTI入力"
        />
        {selectedCode ? <span className="mbti-selected">選択済み</span> : null}
      </div>

      {showOptions ? (
        <div className="mbti-options" role="listbox">
          {filteredOptions.length ? (
            filteredOptions.map((option, idx) => (
              <button
                key={option.code}
                type="button"
                className={`mbti-option${
                  selectedCode === option.code ? " is-selected" : ""
                }${idx === activeIndex ? " is-active" : ""}`}
                onClick={() => handleSelect(option.code)}
                role="option"
                aria-selected={selectedCode === option.code}
              >
                <span className="mbti-code">{option.code}</span>
                <span className="mbti-label">| {option.label}</span>
                {selectedCode === option.code ? (
                  <span className="mbti-check" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="mbti-empty">一致する候補がありません。</div>
          )}
        </div>
      ) : null}

      <a
        className="mbti-link"
        href="https://example.com/mbti-test"
        target="_blank"
        rel="noreferrer"
      >
        MBTIがわからない方はこちら
      </a>
    </div>
  );
}

/** ---------------------------
 *  Modal
 *  -------------------------- */
function EditProfileModal({ draft, onChange, onClose, onSave, onImageChange }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>Edit profile</h3>
          <button
            type="button"
            className="button-outline"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </header>

        <form className="modal-form" onSubmit={onSave}>
          <label className="form-field">
            <span>プロフィール画像</span>
            <div className="upload-row">
              <img
                src={draft.avatarUrl}
                alt="プロフィールプレビュー"
                className="upload-preview"
              />
              <label className="upload-dropzone">
                <span className="upload-icon" aria-hidden="true">
                  ☁️
                </span>
                <span className="upload-text">ここにファイルをドロップ</span>
                <span className="upload-subtext">または</span>
                <span className="upload-button">ファイルを選択</span>
                <input type="file" accept="image/*" onChange={onImageChange} />
              </label>
            </div>
          </label>

          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
            />
          </label>

          <label className="form-field">
            <span>Age</span>
            <input
              type="text"
              value={draft.age}
              onChange={(e) => onChange({ age: e.target.value })}
              required
            />
          </label>

          <label className="form-field">
            <span>Job</span>
            <input
              type="text"
              value={draft.job}
              onChange={(e) => onChange({ job: e.target.value })}
              required
            />
          </label>

          <label className="form-field">
            <span>MBTI（任意）</span>
            <MbtiInput
              value={draft.mbti}
              onChange={(nextValue) => onChange({ mbti: nextValue })}
            />
          </label>

          <label className="form-field">
            <span>BIO</span>
            <textarea
              rows="4"
              value={draft.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="button-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookItemModal({
  mode,
  draft,
  onChange,
  onClose,
  onSave,
  onImageChange,
  onToggleAuto,
  onDropImage,
  suggestions,
  suggestionStatus,
  onSelectSuggestion,
  isSuggestEnabled,
  isAutoSupported,
  categoryTitle,
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card modal-card--book">
        <header className="modal-header">
          <h3>
            {mode === "edit"
              ? `${categoryTitle}を編集`
              : `${categoryTitle}を追加`}
          </h3>
          <button
            type="button"
            className="button-outline"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </header>

        <form className="modal-form" onSubmit={onSave}>
          <label className="form-field">
            <span>タイトル</span>
            <input
              type="text"
              value={draft.title}
              onChange={(event) => onChange({ title: event.target.value })}
              placeholder="タイトルを入力"
              required
            />
            {isSuggestEnabled ? (
              <div className="suggestion-area">
                {suggestionStatus === "loading" ? (
                  <p className="suggestion-status">検索中...</p>
                ) : null}
                {suggestionStatus === "error" ? (
                  <p className="suggestion-status is-error">
                    サジェスト取得に失敗しました。手入力で続行できます。
                  </p>
                ) : null}
                {suggestions.length ? (
                  <div className="suggestion-list" role="listbox">
                    {suggestions.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className="suggestion-item"
                        onClick={() => onSelectSuggestion(item)}
                      >
                        <span className="suggestion-title">{item.title}</span>
                        <span className="suggestion-author">
                          {item.authors || "著者情報なし"}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {!isSuggestEnabled && categoryTitle === "本・漫画" ? (
              <p className="suggestion-status is-muted">
                Google Books APIキーが未設定のためサジェストは無効です。
              </p>
            ) : null}
          </label>

          <label className="form-field">
            <span>著者・作者</span>
            <input
              type="text"
              value={draft.authors}
              onChange={(event) => onChange({ authors: event.target.value })}
              placeholder="著者名を入力"
            />
          </label>

          <label className="form-field">
            <span>表紙画像</span>
            {isAutoSupported ? (
              <div className="toggle-row">
                <span className="toggle-label">自動設定（Google Books）</span>
                <div className="toggle-switch" role="group">
                  <button
                    type="button"
                    className={`toggle-option${
                      draft.imageAuto ? " is-active" : ""
                    }`}
                    onClick={() => onToggleAuto(true)}
                    aria-pressed={draft.imageAuto}
                  >
                    ON
                  </button>
                  <button
                    type="button"
                    className={`toggle-option${
                      !draft.imageAuto ? " is-active" : ""
                    }`}
                    onClick={() => onToggleAuto(false)}
                    aria-pressed={!draft.imageAuto}
                  >
                    OFF
                  </button>
                </div>
              </div>
            ) : (
              <p className="suggestion-status is-muted">
                画像は手動アップロードのみ対応しています。
              </p>
            )}

            <div className="upload-row">
              <img
                src={draft.imageUrl || GOOGLE_BOOKS_PLACEHOLDER}
                alt="表紙プレビュー"
                className="upload-preview"
              />

              {draft.imageAuto && isAutoSupported ? (
                <div className="upload-placeholder">
                  <p>
                    {draft.imageUrl
                      ? "Google Booksの表紙画像を使用中"
                      : "画像が取得できませんでした"}
                  </p>
                  {!draft.imageUrl ? (
                    <p className="upload-helper">
                      必要なら自動設定をOFFにして画像をアップロードしてください。
                    </p>
                  ) : null}
                </div>
              ) : (
                <label
                  className="upload-dropzone"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDropImage}
                >
                  <span className="upload-icon" aria-hidden="true">
                    ☁️
                  </span>
                  <span className="upload-text">ここにファイルをドロップ</span>
                  <span className="upload-subtext">または</span>
                  <span className="upload-button">ファイルを選択</span>
                  <input type="file" accept="image/*" onChange={onImageChange} />
                </label>
              )}
            </div>
          </label>

          <div className="modal-actions">
            <button type="button" className="button-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** ---------------------------
 *  Sidebar
 *  -------------------------- */
function Sidebar({ profile, onEdit }) {
  return (
    <aside className="travel-sidebar">
      <div className="profile-card">
        <div
          className="profile-image"
          style={{ backgroundImage: `url(${profile.avatarUrl})` }}
          aria-hidden="true"
        />
        <dl className="profile-info">
          <div>
            <dt>Name:</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Age:</dt>
            <dd>{profile.age}</dd>
          </div>
          <div>
            <dt>Job:</dt>
            <dd>{profile.job}</dd>
          </div>
          <div>
            <dt>MBTI:</dt>
            <dd>{profile.mbti}</dd>
          </div>
        </dl>

        <div className="profile-bio-card">
          <span className="profile-bio-title">bio</span>
          <p className="profile-bio">{profile.bio}</p>
        </div>

        <div className="profile-actions">
          <button type="button" className="primary" onClick={onEdit}>
            Edit profile
          </button>
          <button type="button" className="button-outline">
            Share
          </button>
        </div>
      </div>

      <nav className="side-menu" aria-label="セクションメニュー">
        <button type="button" className="side-link is-active">
          Stories
        </button>
        <button type="button" className="side-link">
          Collections
        </button>
        <button type="button" className="side-link">
          Favorites
        </button>
        <button type="button" className="side-link">
          Settings
        </button>
      </nav>

      <div className="followers">
        <p className="section-title">Followers</p>
        <div className="avatar-row">
          {suggestionProfiles.map((p) => (
            <img key={p.name} src={p.image} alt={p.name} className="avatar" />
          ))}
          <button type="button" className="avatar-more" aria-label="追加">
            +
          </button>
        </div>
      </div>
    </aside>
  );
}

/** ---------------------------
 *  Category Section
 *  -------------------------- */
function CategorySection({
  category,
  isDragging,
  isDragOver,
  onSectionDragStart,
  onSectionDragOver,
  onSectionDrop,
  onSectionDragEnd,
  itemDragState,
  onItemDragStart,
  onItemDragOver,
  onItemDrop,
  onItemDragEnd,
  onAddItem,
  onEditItem,
  isEditable,
}) {
  const sectionClass = [
    "category-section",
    category.type === "stories" ? "featured" : "photo-feed",
    isDragging ? " is-dragging" : "",
    isDragOver ? " is-dragover" : "",
  ].join("");

  return (
    <section
      className={sectionClass}
      draggable
      onDragStart={onSectionDragStart}
      onDragOver={onSectionDragOver}
      onDrop={onSectionDrop}
      onDragEnd={onSectionDragEnd}
      aria-label={`${category.title} セクション`}
    >
      <div className="section-header">
        <div>
          <h2>{category.title}</h2>
          <p className="section-subtitle">{category.subtitle}</p>
        </div>
        <div className="section-actions">
          <span className="drag-handle" aria-hidden="true">
            ⠿
          </span>
          <span className="drag-hint">ドラッグで並び替え</span>
          {isEditable ? (
            <button
              type="button"
              className="primary"
              onClick={() => onAddItem?.(category.id)}
            >
              追加
            </button>
          ) : null}
          <button type="button" className="button-outline">
            {category.actionLabel}
          </button>
        </div>
      </div>

      {category.type === "stories" ? (
        <div className="story-list">
          {category.items.map((story) => {
            const itemKey = `${category.id}:${story.id}`;
            const isItemDragging = itemDragState.source?.key === itemKey;
            const isItemOver = itemDragState.over?.key === itemKey;

            return (
              <article
                key={story.id}
                className={`story-card${isItemDragging ? " is-dragging" : ""}${
                  isItemOver ? " is-dragover" : ""
                }`}
                draggable
                onDragStart={(e) => onItemDragStart(e, category.id, story.id)}
                onDragOver={(e) => onItemDragOver(e, category.id, story.id)}
                onDrop={(e) => onItemDrop(e, category.id, story.id)}
                onDragEnd={onItemDragEnd}
              >
                <img
                  src={story.imageUrl || GOOGLE_BOOKS_PLACEHOLDER}
                  alt={story.title}
                  className={
                    isEditable ? "story-image is-editable" : "story-image"
                  }
                  role={isEditable ? "button" : undefined}
                  tabIndex={isEditable ? 0 : undefined}
                  onClick={
                    isEditable
                      ? () => {
                          onEditItem?.(category.id, story);
                        }
                      : undefined
                  }
                  onKeyDown={
                    isEditable
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onEditItem?.(category.id, story);
                          }
                        }
                      : undefined
                  }
                />
                <p className="story-title">{story.title}</p>
                <p
                  className={`story-author${
                    story.authors ? "" : " is-empty"
                  }`}
                  aria-hidden={!story.authors}
                >
                  {story.authors || " "}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="photo-grid">
          {category.items.map((photo) => {
            const itemKey = `${category.id}:${photo.id}`;
            const isItemDragging = itemDragState.source?.key === itemKey;
            const isItemOver = itemDragState.over?.key === itemKey;

            return (
              <div
                key={photo.id}
                className={`photo-card${isItemDragging ? " is-dragging" : ""}${
                  isItemOver ? " is-dragover" : ""
                }`}
                draggable
                onDragStart={(e) => onItemDragStart(e, category.id, photo.id)}
                onDragOver={(e) => onItemDragOver(e, category.id, photo.id)}
                onDrop={(e) => onItemDrop(e, category.id, photo.id)}
                onDragEnd={onItemDragEnd}
              >
                <img src={photo.image} alt="" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/** ---------------------------
 *  Main
 *  -------------------------- */
function MainHeader() {
  return (
    <header className="top-bar">
      <div className="search-field" role="search">
        <span aria-hidden="true">🔍</span>
        <input type="search" placeholder="Search stories" />
      </div>
      <div className="top-actions">
        <button type="button" className="icon-button" aria-label="通知">
          🔔
        </button>
        <button type="button" className="icon-button" aria-label="メニュー">
          ⋯
        </button>
      </div>
    </header>
  );
}

/** ---------------------------
 *  Dashboard (container)
 *  -------------------------- */
export default function Dashboard({ user }) {
  const googleBooksApiKey =
    import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || "";
  const [profile, setProfile] = useState({
    name: user?.name || "渡邊 輝",
    age: user?.age || "26",
    job: user?.job || "neat",
    mbti: "ENFP",
    bio: "キングダムにはまってます。",
    avatarUrl: defaultProfileImage,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const [categories, setCategories] = useState(makeInitialCategories);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [itemMode, setItemMode] = useState("add");
  const [activeCategoryId, setActiveCategoryId] = useState("books");
  const [itemDraft, setItemDraft] = useState({
    id: "",
    title: "",
    authors: "",
    imageUrl: "",
    imageAuto: true,
    googleBooksId: null,
    createdAt: null,
    updatedAt: null,
  });
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [suggestionStatus, setSuggestionStatus] = useState("idle");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const sectionDnd = useDndReorder();
  const itemDnd = useDndReorder();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCategories((prev) =>
      prev.map((category) => {
        const storageKey = CATEGORY_STORAGE_KEYS[category.id];
        if (!storageKey) return category;
        const stored = window.localStorage.getItem(storageKey);
        if (!stored) return category;
        try {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed)) return category;
          return { ...category, items: parsed };
        } catch {
          return category;
        }
      })
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    categories.forEach((category) => {
      const storageKey = CATEGORY_STORAGE_KEYS[category.id];
      if (!storageKey) return;
      window.localStorage.setItem(storageKey, JSON.stringify(category.items));
    });
  }, [categories]);

  // --- Profile Edit
  const openEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };
  const closeEdit = () => setIsEditing(false);
  const patchDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patchDraft({ avatarUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setProfile(draft);
    setIsEditing(false);
  };

  const openAddItemModal = (categoryId) => {
    setItemMode("add");
    setActiveCategoryId(categoryId);
    setItemDraft({
      id: "",
      title: "",
      authors: "",
      imageUrl: "",
      imageAuto: categoryId === "books",
      googleBooksId: null,
      createdAt: null,
      updatedAt: null,
    });
    setSelectedSuggestion(null);
    setBookSuggestions([]);
    setSuggestionStatus("idle");
    setIsBookModalOpen(true);
  };

  const openEditItemModal = (categoryId, item) => {
    setItemMode("edit");
    setActiveCategoryId(categoryId);
    setItemDraft({
      ...item,
      imageAuto: categoryId === "books" ? item.imageAuto : false,
    });
    setSelectedSuggestion(
      categoryId === "books" && item.googleBooksId
        ? {
            id: item.googleBooksId,
            title: item.title,
            authors: item.authors,
            imageUrl: item.imageUrl,
          }
        : null
    );
    setBookSuggestions([]);
    setSuggestionStatus("idle");
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => setIsBookModalOpen(false);
  const patchBookDraft = (patch) =>
    setItemDraft((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!googleBooksApiKey) {
      setBookSuggestions([]);
      setSuggestionStatus("idle");
      return;
    }

    if (activeCategoryId !== "books") {
      setBookSuggestions([]);
      setSuggestionStatus("idle");
      return;
    }

    const query = itemDraft.title.trim();
    if (!query) {
      setBookSuggestions([]);
      setSuggestionStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSuggestionStatus("loading");
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
            query
          )}&maxResults=5&key=${googleBooksApiKey}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("failed");
        }
        const data = await response.json();
        const items = Array.isArray(data.items) ? data.items : [];
        const mapped = items.map((item) => ({
          id: item.id,
          title: item.volumeInfo?.title || "",
          authors: item.volumeInfo?.authors?.join(", ") || "",
          imageUrl: item.volumeInfo?.imageLinks?.thumbnail || "",
        }));
        setBookSuggestions(mapped.filter((item) => item.title));
        setSuggestionStatus("success");
      } catch (error) {
        if (error.name === "AbortError") return;
        setSuggestionStatus("error");
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [itemDraft.title, googleBooksApiKey, activeCategoryId]);

  const handleSelectSuggestion = (item) => {
    setSelectedSuggestion(item);
    patchBookDraft({
      title: item.title,
      authors: item.authors,
      googleBooksId: item.id,
      ...(itemDraft.imageAuto ? { imageUrl: item.imageUrl || "" } : {}),
    });
  };

  const handleToggleAuto = (nextValue) => {
    setItemDraft((prev) => {
      if (!nextValue) {
        return { ...prev, imageAuto: false };
      }
      return {
        ...prev,
        imageAuto: true,
        imageUrl: selectedSuggestion?.imageUrl || "",
      };
    });
  };

  const handleBookImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      patchBookDraft({ imageUrl: reader.result, imageAuto: false });
    };
    reader.readAsDataURL(file);
  };

  const handleBookImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      patchBookDraft({ imageUrl: reader.result, imageAuto: false });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBook = (event) => {
    event.preventDefault();
    const timestamp = Date.now();
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== activeCategoryId) return category;
        if (itemMode === "edit") {
          const nextItems = category.items.map((item) =>
            item.id === itemDraft.id
              ? { ...itemDraft, updatedAt: timestamp }
              : item
          );
          return { ...category, items: nextItems };
        }
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `book-${timestamp}-${Math.random().toString(16).slice(2)}`;
        const nextItem = {
          ...itemDraft,
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        return { ...category, items: [...category.items, nextItem] };
      })
    );
    setIsBookModalOpen(false);
  };

  // --- Section DnD
  const onSectionDragStart = (categoryId) => (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", categoryId);
    sectionDnd.setDragState({
      kind: "category",
      source: { id: categoryId },
      over: null,
    });
  };

  const onSectionDragOver = (categoryId) => (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    sectionDnd.setDragState((prev) => ({
      ...prev,
      over: { id: categoryId },
    }));
  };

  const onSectionDrop = (categoryId) => (event) => {
    event.preventDefault();
    const sourceId =
      sectionDnd.dragState.source?.id ||
      event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === categoryId) return sectionDnd.clear();

    setCategories((prev) => reorder(prev, sourceId, categoryId));
    sectionDnd.clear();
  };

  // --- Item DnD
  const onItemDragStart = (event, categoryId, itemId) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    const payload = { categoryId, itemId };
    event.dataTransfer.setData(
      "application/x-category-item",
      JSON.stringify(payload)
    );

    itemDnd.setDragState({
      kind: "item",
      source: { categoryId, id: itemId, key: `${categoryId}:${itemId}` },
      over: null,
    });
  };

  const onItemDragOver = (event, categoryId, itemId) => {
    event.preventDefault();
    event.stopPropagation();
    itemDnd.setDragState((prev) => ({
      ...prev,
      over: { categoryId, id: itemId, key: `${categoryId}:${itemId}` },
    }));
  };

  const onItemDrop = (event, categoryId, itemId) => {
    event.preventDefault();
    event.stopPropagation();

    const source = itemDnd.dragState.source;
    if (!source || source.categoryId !== categoryId) return itemDnd.clear();
    if (source.id === itemId) return itemDnd.clear();

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return { ...cat, items: reorder(cat.items, source.id, itemId) };
      })
    );

    itemDnd.clear();
  };

  return (
    <div className="travel-app">
      <Sidebar profile={profile} onEdit={openEdit} />

      <main className="travel-main">
        <MainHeader />

        {categories.map((category) => {
          const isDragging = sectionDnd.dragState.source?.id === category.id;
          const isDragOver = sectionDnd.dragState.over?.id === category.id;
          const isEditable = EDITABLE_CATEGORY_IDS.includes(category.id);

          return (
            <CategorySection
              key={category.id}
              category={category}
              isDragging={isDragging}
              isDragOver={isDragOver}
              onSectionDragStart={onSectionDragStart(category.id)}
              onSectionDragOver={onSectionDragOver(category.id)}
              onSectionDrop={onSectionDrop(category.id)}
              onSectionDragEnd={sectionDnd.clear}
              itemDragState={itemDnd.dragState}
              onItemDragStart={onItemDragStart}
              onItemDragOver={onItemDragOver}
              onItemDrop={onItemDrop}
              onItemDragEnd={itemDnd.clear}
              onAddItem={openAddItemModal}
              onEditItem={openEditItemModal}
              isEditable={isEditable}
            />
          );
        })}
      </main>

      {isEditing ? (
        <EditProfileModal
          draft={draft}
          onChange={patchDraft}
          onClose={closeEdit}
          onSave={handleSaveProfile}
          onImageChange={handleImageChange}
        />
      ) : null}

      {isBookModalOpen ? (
        <BookItemModal
          mode={itemMode}
          draft={itemDraft}
          onChange={patchBookDraft}
          onClose={closeBookModal}
          onSave={handleSaveBook}
          onImageChange={handleBookImageChange}
          onToggleAuto={handleToggleAuto}
          onDropImage={handleBookImageDrop}
          suggestions={bookSuggestions}
          suggestionStatus={suggestionStatus}
          onSelectSuggestion={handleSelectSuggestion}
          isSuggestEnabled={Boolean(googleBooksApiKey) && activeCategoryId === "books"}
          isAutoSupported={activeCategoryId === "books"}
          categoryTitle={
            categories.find((category) => category.id === activeCategoryId)
              ?.title || ""
          }
        />
      ) : null}
    </div>
  );
}
