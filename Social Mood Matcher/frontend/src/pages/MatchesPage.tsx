import { useState, useEffect } from 'react'
import { matchesApi } from '../api/services'
import { type MatchedUser } from '../types'
import MatchCard from '../components/MatchCard'
import './MatchesPage.css'

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    matchesApi.getMatches()
      .then(r => setMatches(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="container">
        <div className="matches-header fade-in">
          <h1>Your <span className="gradient-text">Matches</span></h1>
          <p className="matches-subtitle">
            People who are feeling exactly the same as you — right now
          </p>
        </div>

        {loading && (
          <div className="matches-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ height: 180, borderRadius: 20 }} />
            ))}
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="empty-state">
            <div className="emoji">🌙</div>
            <p>No matches yet</p>
            <span>Post your current mood on the home page — others who feel the same will appear here</span>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <>
            <div className="matches-count fade-in">
              <span className="matches-badge">{matches.length}</span>
              {matches.length === 1 ? 'person' : 'people'} sharing your vibe right now
            </div>
            <div className="matches-grid fade-in-delay">
              {matches.map(u => <MatchCard key={u.userId} user={u} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
