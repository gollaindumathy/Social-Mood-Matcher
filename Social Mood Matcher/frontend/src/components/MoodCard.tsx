import { type MoodPost, MOOD_CONFIG } from '../types'
import './MoodCard.css'

interface Props {
  mood: MoodPost
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function MoodCard({ mood }: Props) {
  const cfg = MOOD_CONFIG[mood.moodType]

  return (
    <div className="mood-card fade-in">
      <div className="mood-card-header">
        <div className="avatar-circle" style={{ backgroundColor: mood.userAvatarColor }}>
          {mood.userDisplayName[0]?.toUpperCase()}
        </div>
        <div className="mood-card-user">
          <span className="mood-card-name">{mood.userDisplayName}</span>
          <span className="mood-card-time">{timeAgo(mood.createdAt)}</span>
        </div>
        <div className="mood-badge" style={{ color: cfg.color, borderColor: `${cfg.color}40` }}>
          {cfg.emoji} {cfg.label}
        </div>
      </div>
      {mood.description && (
        <p className="mood-card-text">{mood.description}</p>
      )}
    </div>
  )
}
