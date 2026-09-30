import speakingImage from '../assets/ads/speaking.svg'
import aiImage from '../assets/ads/ai.svg'
import businessImage from '../assets/ads/business.svg'
import trialImage from '../assets/ads/trial.svg'

// Fictional sample activity for this portfolio dashboard.
export const ads = [
  {
    id: 1,
    competitor: 'AmazingTalker',
    platform: 'Meta',
    image: speakingImage,
    headline: 'Find your voice in English',
    copy: 'Build everyday speaking confidence with a tutor who understands your goals.',
    angle: 'Speaking Confidence',
    date: 'Sep 28, 2026',
    saved: false,
  },
  {
    id: 2,
    competitor: 'Speak',
    platform: 'Instagram',
    image: aiImage,
    headline: 'A little practice. A lot more confidence.',
    copy: 'Practice real conversations with an AI tutor, whenever you have a few minutes.',
    angle: 'AI English',
    date: 'Sep 27, 2026',
    saved: true,
  },
  {
    id: 3,
    competitor: 'EF English Live',
    platform: 'LinkedIn',
    image: businessImage,
    headline: 'Make your next meeting count',
    copy: 'Learn the English you need to share ideas, lead meetings, and connect at work.',
    angle: 'Business English',
    date: 'Sep 26, 2026',
    saved: false,
  },
  {
    id: 4,
    competitor: 'Cambly',
    platform: 'Meta',
    image: trialImage,
    headline: 'Your first conversation starts here',
    copy: 'Meet a friendly tutor and try a new way to make English part of your day.',
    angle: 'Free Trial',
    date: 'Sep 25, 2026',
    saved: false,
  },
]

export const competitors = [
  { id: 1, name: 'AmazingTalker', category: 'Online tutoring', adCount: 48, activity: '3 new ads this week' },
  { id: 2, name: 'Speak', category: 'AI language learning', adCount: 36, activity: '5 new ads this week' },
  { id: 3, name: 'EF English Live', category: 'Business English', adCount: 27, activity: '2 new ads this week' },
  { id: 4, name: 'Cambly', category: 'Conversation practice', adCount: 45, activity: '4 new ads this week' },
]

export const dashboardStats = [
  { id: 'total', label: 'Total Ads', value: 156, description: 'Across tracked competitors' },
  { id: 'competitors', label: 'Active Competitors', value: 4, description: 'With advertising activity' },
  { id: 'saved', label: 'Saved Ads', value: 12, description: 'In your inspiration library' },
  { id: 'new', label: 'New This Week', value: 14, description: 'Sep 24–30, 2026' },
]

// Share of this week's sample ads; change is in percentage points.
export const trendingAngles = [
  { id: 1, name: 'AI English', percentage: 36, change: 12 },
  { id: 2, name: 'Speaking Confidence', percentage: 29, change: 8 },
  { id: 3, name: 'Business English', percentage: 21, change: 5 },
  { id: 4, name: 'Free Trial', percentage: 14, change: 3 },
]
