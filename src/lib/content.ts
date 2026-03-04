// Content types
export interface ContentPiece {
  id: string
  type: 'image' | 'video' | 'carousel'
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok'
  status: 'generating' | 'completed' | 'failed'
  icpProfileId: string
  prompt?: string
  imageUrl?: string
  videoUrl?: string
  copy?: {
    headline: string
    body: string
    cta: string
    hashtags: string[]
  }
  metadata: {
    createdAt: string
    updatedAt: string
    objective?: string
    targetAudience?: string
  }
}

export interface ICPProfile {
  id: string
  name: string
  businessName: string
  industry: string
  demographics: {
    ageRange: string
    location: string
    gender: string
  }
  psychographics: {
    desires: string[]
    fears: string[]
    values: string[]
    interests: string[]
  }
  painPoints: Array<{
    pain: string
    intensity: 'low' | 'medium' | 'high'
    solution: string
  }>
  brandVoice: {
    tone: string
    style: string
    language: string
  }
  visualPreferences: {
    colors: string[]
    style: string
    mood: string
  }
  createdAt: string
  updatedAt: string
}

export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok'
export type ContentType = 'post' | 'story' | 'reel' | 'carousel'

// Platform configurations
export const platformConfigs: Record<Platform, {
  name: string
  color: string
  bgColor: string
  icon: string
}> = {
  instagram: {
    name: 'Instagram',
    color: 'text-pink-500',
    bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
    icon: 'instagram'
  },
  facebook: {
    name: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-r from-blue-600 to-blue-700',
    icon: 'facebook'
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'text-blue-700',
    bgColor: 'bg-gradient-to-r from-blue-600 to-blue-800',
    icon: 'linkedin'
  },
  tiktok: {
    name: 'TikTok',
    color: 'text-gray-900',
    bgColor: 'bg-gradient-to-r from-gray-900 to-gray-800',
    icon: 'tiktok'
  }
}

// Content type configurations
export const contentTypeConfigs: Record<ContentType, {
  name: string
  description: string
  aspectRatio: string
}> = {
  post: {
    name: 'Post',
    description: 'Postagem estática para feed',
    aspectRatio: '1:1'
  },
  story: {
    name: 'Story',
    description: 'Story vertical de 15 segundos',
    aspectRatio: '9:16'
  },
  reel: {
    name: 'Reel',
    description: 'Vídeo curto de 15-60 segundos',
    aspectRatio: '9:16'
  },
  carousel: {
    name: 'Carrossel',
    description: 'Múltiplos slides em sequência',
    aspectRatio: '1:1'
  }
}
