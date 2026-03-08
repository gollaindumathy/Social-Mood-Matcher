export type MoodType = 'Happy' | 'Sad' | 'Angry' | 'Calm' | 'Stressed' | 'Excited'

export interface AuthResponse {
  token: string
  userId: string
  email: string
  displayName: string
  avatarColor: string
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  bio: string
  avatarColor: string
  createdAt: string
}

export interface UpdateProfileDto {
  displayName?: string
  bio?: string
  avatarColor?: string
}

export interface MoodPost {
  id: number
  userId: string
  userDisplayName: string
  userAvatarColor: string
  moodType: MoodType
  description: string
  createdAt: string
}

export interface MatchedUser {
  userId: string
  displayName: string
  avatarColor: string
  currentMood: MoodType
  latestMoodDescription: string
  moodPostedAt: string
}

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string }> = {
  Happy:    { emoji: '😊', label: 'Happy',    color: '#ffd32a' },
  Sad:      { emoji: '😔', label: 'Sad',      color: '#74b9ff' },
  Angry:    { emoji: '😡', label: 'Angry',    color: '#ff6b6b' },
  Calm:     { emoji: '😌', label: 'Calm',     color: '#0be881' },
  Stressed: { emoji: '😰', label: 'Stressed', color: '#fd79a8' },
  Excited:  { emoji: '🤩', label: 'Excited',  color: '#a29bfe' },
}

export const ALL_MOODS = Object.keys(MOOD_CONFIG) as MoodType[]
