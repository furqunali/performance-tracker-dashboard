// Shared visual language: validated categorical palette + status helpers.
// Categorical palette validated with the dataviz palette validator
// (light surface, CVD-safe): teal / indigo / amber / rose / violet / cyan.

export const CATEGORICAL = [
  '#0d9488', // teal (brand)
  '#4f46e5', // indigo
  '#f59e0b', // amber
  '#e11d48', // rose
  '#7c3aed', // violet
  '#0891b2', // cyan
];

// Status ramp is reserved and never reused as a categorical hue.
export const STATUS = {
  onTrack: { color: '#059669', bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'On track' },
  watch: { color: '#d97706', bg: 'bg-amber-100', text: 'text-amber-700', label: 'Watch' },
  atRisk: { color: '#e11d48', bg: 'bg-rose-100', text: 'text-rose-700', label: 'At risk' },
};

export function statusFor(pct) {
  if (pct >= 95) return STATUS.onTrack;
  if (pct >= 80) return STATUS.watch;
  return STATUS.atRisk;
}

export function segmentColor(index) {
  return CATEGORICAL[index % CATEGORICAL.length];
}
