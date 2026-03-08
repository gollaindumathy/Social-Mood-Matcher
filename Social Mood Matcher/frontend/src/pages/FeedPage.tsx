import { useState, useEffect } from 'react'
import { moodsApi } from '../api/services'
import { type MoodPost, type MoodType, MOOD_CONFIG, ALL_MOODS } from '../types'
import MoodCard from '../components/MoodCard'
import './FeedPage.css'

export default function FeedPage() {
  const [feed, setFeed] = useState<MoodPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<MoodType | 'all'>('all')

  useEffect(() => {
    moodsApi.getFeed()
      .then(r => setFeed(r.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'all'
    ? feed
    : feed.filter(m => m.moodType === activeFilter)

  return (
    <div className="page">
      <div className="container">
        <div className="feed-header fade-in">
          <h1>Mood <span className="gradient-text">Feed</span></h1>
          <p className="feed-subtitle">Posts from people sharing your vibe right now</p>
        </div>

        {/* Filter pills */}
        <div className="feed-filters fade-in-delay">
          <button
            className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          {ALL_MOODS.map(mood => {
            const cfg = MOOD_CONFIG[mood]
            return (
              <button
                key={mood}
                className={`filter-pill ${activeFilter === mood ? 'active' : ''}`}
                style={activeFilter === mood ? { borderColor: cfg.color, color: cfg.color } : {}}
                onClick={() => setActiveFilter(mood)}
              >
                {cfg.emoji} {cfg.label}
              </button>
            )
          })}
        </div>

        {loading && (
          <div className="feed-list">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="emoji">🌊</div>
            <p>No posts yet</p>
            <span>Post your mood on the home page to get matching content here</span>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="feed-list">
            {filtered.map(m => <MoodCard key={m.id} mood={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}
