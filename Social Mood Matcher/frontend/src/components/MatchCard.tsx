import { type MatchedUser, MOOD_CONFIG } from '../types'
import './MatchCard.css'

interface Props {
  user: MatchedUser
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

export default function MatchCard({ user }: Props) {
  const cfg = MOOD_CONFIG[user.currentMood]

  return (
    <div className="match-card fade-in">
      <div className="match-avatar" style={{ backgroundColor: user.avatarColor, boxShadow: `0 0 20px ${user.avatarColor}40` }}>
        {user.displayName[0]?.toUpperCase()}
      </div>
      <div className="match-badge" style={{ color: cfg.color }}>
        {cfg.emoji} {cfg.label}
      </div>
      <div className="match-name">{user.displayName}</div>
      {user.latestMoodDescription && (
        <p className="match-desc">"{user.latestMoodDescription}"</p>
      )}
      <div className="match-time">{timeAgo(user.moodPostedAt)}</div>
    </div>
  )
}
