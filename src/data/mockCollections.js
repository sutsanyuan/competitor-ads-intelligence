// Collections reference existing ads by ID instead of copying ad objects.
// These sample groups are independent of the page-local bookmark state.
export const collections = [
  {
    id: 1,
    name: 'AI Messaging',
    description: 'Ads focused on AI-powered learning and everyday practice.',
    adIds: [2, 5],
  },
  {
    id: 2,
    name: 'Free Trial Campaigns',
    description: 'Trial offers and first conversations that invite learners to get started.',
    adIds: [4, 6],
  },
  {
    id: 3,
    name: 'Speaking Confidence',
    description: 'Messaging that helps learners feel more confident speaking English.',
    adIds: [1, 7],
  },
]
