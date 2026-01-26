const featuredStories = [
  {
    title: 'Short Means',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Summer Escape',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: "Knight's Story",
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Love Story',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Paradise City',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
  },
]

const photoFeed = [
  {
    id: 'alps-house',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'arctic-boat',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lake-couple',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'valley-hike',
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'goat-keeper',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mountain-peaks',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
  },
]

const suggestionProfiles = [
  {
    name: 'Johan',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'Mina',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'Hugo',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80',
  },
]

const Dashboard = () => (
  <div className="travel-app">
    <aside className="travel-sidebar">
      <div className="profile-card">
        <div className="profile-image" aria-hidden="true" />
        <div className="profile-meta">
          <p className="profile-name">Karry Woodson</p>
          <span className="profile-status">Photographer · Tokyo</span>
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
      <section className="featured">
        <div className="section-header">
          <h2>Featured Stories</h2>
          <button type="button" className="ghost">
            View all
          </button>
        </div>
        <div className="story-list">
          {featuredStories.map((story) => (
            <article key={story.title} className="story-card">
              <img src={story.image} alt={story.title} />
              <p>{story.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="photo-feed">
        <div className="section-header">
          <h2>Photo Feed</h2>
        </div>
        <div className="photo-grid">
          {photoFeed.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img src={photo.image} alt="" />
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
)

export default Dashboard
