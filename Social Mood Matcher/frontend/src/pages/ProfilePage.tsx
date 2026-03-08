import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { authApi, moodsApi } from '../api/services'
import { type MoodPost } from '../types'
import MoodCard from '../components/MoodCard'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [myMoods, setMyMoods] = useState<MoodPost[]>([])
  const [moodsLoading, setMoodsLoading] = useState(true)

  useEffect(() => {
    moodsApi.getMyMoods()
      .then(r => setMyMoods(r.data))
      .finally(() => setMoodsLoading(false))
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      await authApi.updateProfile({ displayName, bio })
      await refreshUser()
      setSaveMsg('Profile updated!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-hero fade-in">
          <div
            className="profile-avatar"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.displayName[0]?.toUpperCase()}
          </div>
          <div>
            <h1>{user.displayName}</h1>
            <p className="profile-email">{user.email}</p>
            {user.bio && <p className="profile-bio-display">{user.bio}</p>}
          </div>
        </div>

        <div className="profile-layout">
          {/* Edit form */}
          <div className="card fade-in-delay">
            <h2 className="section-title">✏️ Edit Profile</h2>
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label htmlFor="pDisplayName">Display Name</label>
                <input
                  id="pDisplayName"
                  type="text"
                  className="input-field"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pBio">Bio</label>
                <textarea
                  id="pBio"
                  className="input-field"
                  rows={3}
                  placeholder="Tell people a bit about yourself…"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={300}
                  style={{ resize: 'none' }}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {saveMsg && (
                <p className={`save-msg ${saveMsg.includes('!') ? 'success' : 'error'}`}>
                  {saveMsg}
                </p>
              )}
            </form>
          </div>

          {/* My mood history */}
          <div>
            <h2 className="section-title fade-in">📖 My Mood History</h2>
            {moodsLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />)}
              </div>
            )}
            {!moodsLoading && myMoods.length === 0 && (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="emoji" style={{ fontSize: 32 }}>📭</div>
                <p>No moods posted yet</p>
              </div>
            )}
            {!moodsLoading && (
              <div className="feed-list">
                {myMoods.map(m => <MoodCard key={m.id} mood={m} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
