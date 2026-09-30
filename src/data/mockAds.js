import speakingImage from '../assets/ads/speaking.svg'
import aiImage from '../assets/ads/ai.svg'
import businessImage from '../assets/ads/business.svg'
import trialImage from '../assets/ads/trial.svg'

// Fictional sample activity, ordered newest first, shared by both pages.
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
    platform: 'Meta',
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
    platform: 'Google',
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
  {
    id: 5,
    competitor: 'Speak',
    platform: 'TikTok',
    image: aiImage,
    headline: 'Turn your coffee break into conversation',
    copy: 'Spend five minutes practicing English with instant AI feedback on your pronunciation.',
    angle: 'AI English',
    date: 'Sep 24, 2026',
    saved: true,
  },
  {
    id: 6,
    competitor: 'AmazingTalker',
    platform: 'Google',
    image: trialImage,
    headline: 'Meet your next English tutor',
    copy: 'Start with a free trial and find a learning plan that fits your schedule.',
    angle: 'Free Trial',
    date: 'Sep 23, 2026',
    saved: false,
  },
  {
    id: 7,
    competitor: 'Cambly',
    platform: 'TikTok',
    image: speakingImage,
    headline: 'Less overthinking. More speaking.',
    copy: 'From travel stories to everyday small talk, practice with a friendly conversation partner.',
    angle: 'Speaking Confidence',
    date: 'Sep 22, 2026',
    saved: false,
  },
  {
    id: 8,
    competitor: 'EF English Live',
    platform: 'Meta',
    image: businessImage,
    headline: 'Pitch your ideas with clarity',
    copy: 'Prepare for presentations and job interviews with practical, teacher-led English lessons.',
    angle: 'Business English',
    date: 'Sep 21, 2026',
    saved: true,
  },
]

// Handwritten example analysis keyed by ad ID, not AI output.
// Message Angle uses the corresponding ad's angle field.
export const adAnalysis = {
  1: {
    targetAudience: 'Adult learners who hesitate to speak English in everyday situations.',
    hook: 'Find your voice frames learning as personal confidence.',
    painPoint: 'Fear of mistakes and lessons that do not fit individual goals.',
    keyBenefit: 'Personal support from a tutor who understands the learner.',
    offer: 'Personalized English tutoring; no discount stated.',
    cta: 'Find a tutor (suggested example CTA).',
    funnelStage: 'Consideration — introduces a tailored learning approach.',
  },
  2: {
    targetAudience: 'Busy learners looking for short, flexible speaking practice.',
    hook: 'A little practice promises progress without a large time commitment.',
    painPoint: 'Limited time and few opportunities to practice conversations.',
    keyBenefit: 'An AI tutor available whenever the learner has a few minutes.',
    offer: 'On-demand AI conversation practice; no trial stated.',
    cta: 'Start practicing (suggested example CTA).',
    funnelStage: 'Awareness — introduces an accessible practice habit.',
  },
  3: {
    targetAudience: 'Professionals who use English in meetings and team discussions.',
    hook: 'Make your next meeting count connects learning to an immediate work need.',
    painPoint: 'Difficulty expressing ideas clearly in workplace conversations.',
    keyBenefit: 'Practical English for sharing ideas and leading meetings.',
    offer: 'Workplace English learning; no promotional offer stated.',
    cta: 'Explore business English (suggested example CTA).',
    funnelStage: 'Consideration — links lessons to professional outcomes.',
  },
  4: {
    targetAudience: 'New learners curious about online conversation tutoring.',
    hook: 'Your first conversation makes the starting point feel approachable.',
    painPoint: 'Uncertainty about getting started and finding a friendly tutor.',
    keyBenefit: 'A welcoming introduction to everyday English practice.',
    offer: 'Trial positioning; pricing and duration are unspecified in this creative.',
    cta: 'Try a conversation (suggested example CTA).',
    funnelStage: 'Conversion — encourages a first tutoring experience.',
  },
  5: {
    targetAudience: 'Mobile learners with short breaks in their daily routine.',
    hook: 'A coffee break becomes a practical opportunity to learn.',
    painPoint: 'Difficulty finding study time and knowing how to improve pronunciation.',
    keyBenefit: 'Five-minute practice sessions with instant pronunciation feedback.',
    offer: 'AI-guided speaking practice; no discount stated.',
    cta: 'Practice for five minutes (suggested example CTA).',
    funnelStage: 'Consideration — demonstrates how the product fits a daily routine.',
  },
  6: {
    targetAudience: 'Learners comparing tutors before committing to lessons.',
    hook: 'Meet your next tutor makes the search feel personal and straightforward.',
    painPoint: 'Uncertainty about tutor fit and lesson scheduling.',
    keyBenefit: 'A learning plan suited to the learner’s schedule.',
    offer: 'A free trial; duration and eligibility are not specified.',
    cta: 'Start a free trial (suggested example CTA).',
    funnelStage: 'Conversion — reduces the barrier to trying a tutor.',
  },
  7: {
    targetAudience: 'Learners who know English but overthink before speaking.',
    hook: 'Less overthinking. More speaking. names a familiar frustration.',
    painPoint: 'Anxiety about speaking spontaneously in everyday conversations.',
    keyBenefit: 'Friendly practice with relatable topics such as travel and small talk.',
    offer: 'Conversation practice with a partner; no promotion stated.',
    cta: 'Find a conversation partner (suggested example CTA).',
    funnelStage: 'Awareness — connects with an emotional speaking barrier.',
  },
  8: {
    targetAudience: 'Professionals and job seekers preparing for high-stakes conversations.',
    hook: 'Pitch your ideas with clarity emphasizes a specific career skill.',
    painPoint: 'Difficulty presenting ideas or answering interview questions in English.',
    keyBenefit: 'Teacher-led preparation for presentations and job interviews.',
    offer: 'Practical English lessons; no promotional pricing stated.',
    cta: 'Explore lessons (suggested example CTA).',
    funnelStage: 'Consideration — presents lessons as preparation for career moments.',
  },
}

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
