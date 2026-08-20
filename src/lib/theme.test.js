import { describe, it, expect } from 'vitest';
import { statusFor, segmentColor, STATUS, CATEGORICAL } from './theme.js';

describe('statusFor', () => {
  it('classifies >= 95 as on track', () => {
    expect(statusFor(95)).toBe(STATUS.onTrack);
    expect(statusFor(100)).toBe(STATUS.onTrack);
  });

  it('classifies 80-94 as watch', () => {
    expect(statusFor(80)).toBe(STATUS.watch);
    expect(statusFor(94)).toBe(STATUS.watch);
  });

  it('classifies < 80 as at risk', () => {
    expect(statusFor(79)).toBe(STATUS.atRisk);
    expect(statusFor(0)).toBe(STATUS.atRisk);
  });
});

describe('segmentColor', () => {
  it('returns palette colors and wraps around the end', () => {
    expect(segmentColor(0)).toBe(CATEGORICAL[0]);
    expect(segmentColor(CATEGORICAL.length)).toBe(CATEGORICAL[0]);
    expect(segmentColor(CATEGORICAL.length + 2)).toBe(CATEGORICAL[2]);
  });
});
