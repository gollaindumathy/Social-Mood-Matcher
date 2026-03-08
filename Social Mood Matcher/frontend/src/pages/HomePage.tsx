import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { moodsApi, matchesApi } from '../api/services'
import { MOOD_CONFIG, ALL_MOODS, type MoodType, type MoodPost, type MatchedUser } from '../types'
import MatchCard from '../components/MatchCard'
import MoodCard from '../components/MoodCard'
import './HomePage.css'

export default function HomePage() {
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [description, setDescription] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')
  const [postSuccess, setPostSuccess] = useState(false)
  const [matches, setMatches] = useState<MatchedUser[]>([])
  const [recentFeed, setRecentFeed] = useState<MoodPost[]>([])
  const [feedLoading, setFeedLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      matchesApi.getMatches().then(r => setMatches(r.data)),
      moodsApi.getFeed().then(r => setRecentFeed(r.data.slice(0, 3))),
    ]).finally(() => setFeedLoading(false))
  }, [postSuccess])

  const handlePost = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedMood) return
    setPosting(true)
    setPostError('')
    try {
      await moodsApi.postMood(selectedMood, description)
      setDescription('')
      setPostSuccess(p => !p)
    } catch {
      setPostError('Could not post mood. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Hero greeting */}
        <div className="home-hero fade-in">
          <h1>Hey, <span className="gradient-text">{user?.displayName}</span></h1>
          <p className="home-subtitle">How are you <em>really</em> feeling right now?</p>
        </div>

        {/* Mood picker */}
        <form onSubmit={handlePost} className="mood-form card fade-in-delay">
          <div className="mood-picker-grid">
            {ALL_MOODS.map(mood => {
              const cfg = MOOD_CONFIG[mood]
              const active = selectedMood === mood
              return (
                <button
                  key={mood}
                  type="button"
                  className={`mood-pill ${active ? 'active' : ''}`}
                  style={active ? { borderColor: cfg.color, background: `${cfg.color}18`, color: cfg.color } : {}}
                  onClick={() => setSelectedMood(mood)}
                >
                  <span className="mood-emoji">{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </button>
              )
            })}
          </div>

          {selectedMood && (
            <div className="mood-description-area fade-in">
              <textarea
                className="input-field mood-textarea"
                placeholder={`What's making you feel ${MOOD_CONFIG[selectedMood].label.toLowerCase()}?`}
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              {postError && <div className="error-msg">{postError}</div>}
              <button type="submit" className="btn-primary" disabled={posting}>
                {posting ? 'Posting…' : `Share your ${MOOD_CONFIG[selectedMood].emoji} mood`}
              </button>
            </div>
          )}
        </form>

        {/* Quick Matches */}
        {!feedLoading && matches.length > 0 && (
          <div className="home-section fade-in-delay-2">
            <h2 className="section-title">🤝 People feeling like you right now</h2>
            <div className="matches-grid">
              {matches.slice(0, 6).map(u => <MatchCard key={u.userId} user={u} />)}
            </div>
          </div>
        )}

        {/* Quick Feed */}
        {!feedLoading && recentFeed.length > 0 && (
          <div className="home-section fade-in-delay-2">
            <h2 className="section-title">✨ From your mood circle</h2>
            <div className="feed-list">
              {recentFeed.map(m => <MoodCard key={m.id} mood={m} />)}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!feedLoading && matches.length === 0 && recentFeed.length === 0 && (
          <div className="empty-state fade-in-delay-2">
            <div className="emoji">🌟</div>
            <p>You're the first one here!</p>
            <span>Post your mood and start the conversation</span>
          </div>
        )}
      </div>
    </div>
  )
}
