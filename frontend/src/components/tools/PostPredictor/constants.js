export const CATEGORIES = [
  { id: 1, name: 'Film & Animation' }, { id: 2, name: 'Autos & Vehicles' },
  { id: 10, name: 'Music' }, { id: 15, name: 'Pets & Animals' },
  { id: 17, name: 'Sports' }, { id: 19, name: 'Travel & Events' },
  { id: 20, name: 'Gaming' }, { id: 22, name: 'People & Blogs' },
  { id: 23, name: 'Comedy' }, { id: 24, name: 'Entertainment' },
  { id: 25, name: 'News & Politics' }, { id: 26, name: 'Howto & Style' },
  { id: 27, name: 'Education' }, { id: 28, name: 'Science & Technology' },
];

export const SUBSCRIBER_RANGES = [
  { value: 500, label: '0 – 1K', min: 0, max: 1000 },
  { value: 5000, label: '1K – 10K', min: 1000, max: 10000 },
  { value: 25000, label: '10K – 50K', min: 10000, max: 50000 },
  { value: 75000, label: '50K – 100K', min: 50000, max: 100000 },
  { value: 175000, label: '100K – 250K', min: 100000, max: 250000 },
  { value: 375000, label: '250K – 500K', min: 250000, max: 500000 },
  { value: 750000, label: '500K – 1M', min: 500000, max: 1000000 },
  { value: 5000000, label: '1M – 10M', min: 1000000, max: 10000000 },
  { value: 15000000, label: '10M+', min: 10000000, max: Infinity },
];

export const rangeFor = (subs) =>
  SUBSCRIBER_RANGES.find((r) => subs >= r.min && subs < r.max) ?? SUBSCRIBER_RANGES[SUBSCRIBER_RANGES.length - 1];

export const DURATION_PRESETS = [
  { label: 'Short', seconds: 45 },
  { label: '8 min', seconds: 480 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
];

export const TITLE_MAX = 100;
export const GUEST_DAILY_LIMIT = 5;

export const EMPTY_FORM = {
  title: '',
  description: '',
  thumbnail_url: '',
  thumbnail_file: null,
  category_id: 24,
  subscriber_count: 25000,
  duration_seconds: 600,
};
