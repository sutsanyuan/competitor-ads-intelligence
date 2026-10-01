import { ads as mockAds } from './mockAds'
import { realAds } from './realAds'

// Keep examples out of browsing and summary counts until manually replaced.
export const ads = [...realAds.filter((ad) => !ad.isPlaceholder), ...mockAds]
