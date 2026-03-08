import api from './client'
import type { AuthResponse, UpdateProfileDto, UserProfile } from '../types'

export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, displayName }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  getMe: () =>
    api.get<UserProfile>('/auth/me'),

  updateProfile: (data: UpdateProfileDto) =>
    api.put<UserProfile>('/auth/profile', data),
}

export const moodsApi = {
  postMood: (moodType: string, description: string) =>
    api.post('/moods', { moodType, description }),

  getMyMoods: () =>
    api.get('/moods/mine'),

  getFeed: () =>
    api.get('/moods/feed'),

  getCurrentMood: () =>
    api.get('/moods/current'),
}

export const matchesApi = {
  getMatches: () =>
    api.get('/matches'),
}
