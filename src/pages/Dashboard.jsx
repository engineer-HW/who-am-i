import { useEffect, useState } from "react";

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

const MbtiInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [selectedCode, setSelectedCode] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value || "");
    setSelectedCode(value || "");
    setActiveIndex(-1);
  }, [value]);

  const normalizedInput = inputValue.trim().toLowerCase();
  const filteredOptions = mbtiOptions.filter((option) => {
    if (!normalizedInput) return true;
    return option.code.toLowerCase().includes(normalizedInput);
  });

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
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowOptions(true);
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    }

    if (event.key === "Enter" && showOptions) {
      const option = filteredOptions[activeIndex];
      if (option) {
        event.preventDefault();
        handleSelect(option.code);
      }
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
        />
        {selectedCode ? <span className="mbti-selected">選択済み</span> : null}
      </div>
      {showOptions ? (
        <div className="mbti-options" role="listbox">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`mbti-option${
                  selectedCode === option.code ? " is-selected" : ""
                }${
                  option.code === filteredOptions[activeIndex]?.code
                    ? " is-active"
                    : ""
                }`}
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
};

const Dashboard = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || "渡邊 輝",
    age: user?.age || "26",
    job: user?.job || "neat",
    mbti: "ENFP",
    bio: "キングダムにはまってます。",
    avatarUrl: defaultProfileImage,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState(profileData);
  const [categories, setCategories] = useState([
    {
      id: "books",
      title: "本・漫画",
      subtitle: "最近チェックした作品。",
      type: "stories",
      actionLabel: "View all",
    },
    {
      id: "games",
      title: "ゲーム",
      subtitle: "気になるタイトル。",
      type: "photos",
      actionLabel: "Filter",
    },
    {
      id: "habits",
      title: "習慣",
      subtitle: "続けたいルーティン。",
      type: "photos",
      actionLabel: "Filter",
    },
  ]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const handleOpenEdit = () => {
    setDraftProfile(profileData);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleDraftChange = (field) => (event) => {
    setDraftProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraftProfile((prev) => ({
        ...prev,
        avatarUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setProfileData(draftProfile);
    setIsEditing(false);
  };

  const handleDragStart = (categoryId) => (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", categoryId);
    setDraggingId(categoryId);
  };

  const handleDragOver = (categoryId) => (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverId(categoryId);
  };

  const handleDrop = (categoryId) => (event) => {
    event.preventDefault();
    const sourceId =
      draggingId || event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === categoryId) {
      setDragOverId(null);
      return;
    }

    setCategories((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((item) => item.id === sourceId);
      const toIndex = next.findIndex((item) => item.id === categoryId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="travel-app">
      <aside className="travel-sidebar">
        <div className="profile-card">
          <div
            className="profile-image"
            style={{ backgroundImage: `url(${profileData.avatarUrl})` }}
            aria-hidden="true"
          />
          <dl className="profile-info">
            <div>
              <dt>Name:</dt>
              <dd>{profileData.name}</dd>
            </div>
            <div>
              <dt>Age:</dt>
              <dd>{profileData.age}</dd>
            </div>
            <div>
              <dt>Job:</dt>
              <dd>{profileData.job}</dd>
            </div>
            <div>
              <dt>MBTI:</dt>
              <dd>{profileData.mbti}</dd>
            </div>
          </dl>
          <div className="profile-bio-card">
            <span className="profile-bio-title">bio</span>
            <p className="profile-bio">{profileData.bio}</p>
          </div>
          <div className="profile-actions">
            <button type="button" className="primary" onClick={handleOpenEdit}>
              Edit profile
            </button>
            <button type="button" className="ghost">
              Share
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-card">
              <header className="modal-header">
                <h3>Edit profile</h3>
                <button
                  type="button"
                  className="ghost"
                  onClick={handleCloseEdit}
                  aria-label="閉じる"
                >
                  ✕
                </button>
              </header>
              <form className="modal-form" onSubmit={handleSaveProfile}>
                <label className="form-field">
                  <span>プロフィール画像</span>
                  <div className="upload-row">
                    <img
                      src={draftProfile.avatarUrl}
                      alt="プロフィールプレビュー"
                      className="upload-preview"
                    />
                    <label className="upload-dropzone">
                      <span className="upload-icon" aria-hidden="true">
                        ☁️
                      </span>
                      <span className="upload-text">
                        ここにファイルをドロップ
                      </span>
                      <span className="upload-subtext">または</span>
                      <span className="upload-button">ファイルを選択</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </label>
                <label className="form-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={draftProfile.name}
                    onChange={handleDraftChange("name")}
                    required
                  />
                </label>
                <label className="form-field">
                  <span>Age</span>
                  <input
                    type="text"
                    value={draftProfile.age}
                    onChange={handleDraftChange("age")}
                    required
                  />
                </label>
                <label className="form-field">
                  <span>Job</span>
                  <input
                    type="text"
                    value={draftProfile.job}
                    onChange={handleDraftChange("job")}
                    required
                  />
                </label>
                <label className="form-field">
                  <span>MBTI（任意）</span>
                  <MbtiInput
                    value={draftProfile.mbti}
                    onChange={(nextValue) =>
                      setDraftProfile((prev) => ({
                        ...prev,
                        mbti: nextValue,
                      }))
                    }
                  />
                </label>
                <label className="form-field">
                  <span>BIO</span>
                  <textarea
                    rows="4"
                    value={draftProfile.bio}
                    onChange={handleDraftChange("bio")}
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={handleCloseEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
            {suggestionProfiles.map((profile) => (
              <img
                key={profile.name}
                src={profile.image}
                alt={profile.name}
                className="avatar"
              />
            ))}
            <button type="button" className="avatar-more" aria-label="追加">
              +
            </button>
          </div>
        </div>
      </aside>

      <main className="travel-main">
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

        {categories.map((category) => (
          <section
            key={category.id}
            className={`category-section ${
              category.type === "stories" ? "featured" : "photo-feed"
            }${draggingId === category.id ? " is-dragging" : ""}${
              dragOverId === category.id ? " is-dragover" : ""
            }`}
            draggable
            onDragStart={handleDragStart(category.id)}
            onDragOver={handleDragOver(category.id)}
            onDrop={handleDrop(category.id)}
            onDragEnd={handleDragEnd}
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
                <button type="button" className="ghost">
                  {category.actionLabel}
                </button>
              </div>
            </div>
            {category.type === "stories" ? (
              <div className="story-list">
                {featuredStories.map((story) => (
                  <article key={story.title} className="story-card">
                    <img src={story.image} alt={story.title} />
                    <p className="story-title">{story.title}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="photo-grid">
                {photoFeed.map((photo) => (
                  <div key={`${photo.id}-${category.id}`} className="photo-card">
                    <img src={photo.image} alt="" />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
