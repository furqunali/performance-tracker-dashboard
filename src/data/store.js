// Lightweight self-contained data store.
// Replaces the original base44 backend so the app runs fully client-side.
// State is seeded from src/data/seed.js and persisted to localStorage.

import { useSyncExternalStore } from 'react';
import {
  CURRENT_USER,
  CORPORATE_GOALS,
  DEPARTMENTAL_GOALS,
  BUSINESS_SEGMENTS,
  KPI_REPORTS,
} from './seed.js';

export const STORAGE_KEY = 'performance-tracker.v1';

export function seedState() {
  return {
    user: { ...CURRENT_USER },
    corporateGoals: CORPORATE_GOALS.map((g) => ({ ...g })),
    departmentalGoals: DEPARTMENTAL_GOALS.map((g) => ({ ...g })),
    businessSegments: BUSINESS_SEGMENTS.map((s) => ({ ...s })),
    kpiReports: KPI_REPORTS.map((r) => ({ ...r })),
  };
}

// A persisted blob is only trusted if it has the exact shape we expect.
// A partial or tampered object is rejected so we never render against
// half-valid state (which would crash components downstream).
export function isValidState(s) {
  return (
    !!s &&
    typeof s === 'object' &&
    !!s.user &&
    typeof s.user === 'object' &&
    typeof s.user.role === 'string' &&
    Array.isArray(s.corporateGoals) &&
    Array.isArray(s.departmentalGoals) &&
    Array.isArray(s.businessSegments) &&
    Array.isArray(s.kpiReports)
  );
}

// Pure, testable parser: returns valid state or null. Guards against both
// malformed JSON (throws) and structurally invalid JSON (wrong shape).
export function parseStored(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function load() {
  try {
    const parsed = parseStored(localStorage.getItem(STORAGE_KEY));
    if (parsed) return parsed;
  } catch (e) {
    // localStorage itself may be unavailable (e.g. blocked) — reseed.
  }
  return seedState();
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // storage may be unavailable (private mode) — keep working in-memory
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Return a stable snapshot per collection so useSyncExternalStore is happy.
function getSnapshot() {
  return state;
}

// ---- Public API ----------------------------------------------------------

export function useStore(selector) {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot())
  );
}

export const store = {
  getUser: () => state.user,

  setRole(role) {
    state = { ...state, user: { ...state.user, role } };
    emit();
  },

  addReport(report) {
    const record = {
      id: `kr_${Date.now()}`,
      submitted_date: new Date().toISOString().slice(0, 10),
      created_by: state.user.email,
      ...report,
    };
    state = { ...state, kpiReports: [record, ...state.kpiReports] };
    emit();
    return record;
  },

  deleteReport(id) {
    state = {
      ...state,
      kpiReports: state.kpiReports.filter((r) => r.id !== id),
    };
    emit();
  },

  addCorporateGoal(goal) {
    const record = {
      id: `cg_${Date.now()}`,
      target_percentage: 100,
      trend: [goal.current_percentage || 0],
      ...goal,
    };
    state = { ...state, corporateGoals: [...state.corporateGoals, record] };
    emit();
    return record;
  },

  updateCorporateGoal(id, patch) {
    state = {
      ...state,
      corporateGoals: state.corporateGoals.map((g) =>
        g.id === id ? { ...g, ...patch } : g
      ),
    };
    emit();
  },

  deleteCorporateGoal(id) {
    state = {
      ...state,
      corporateGoals: state.corporateGoals.filter((g) => g.id !== id),
    };
    emit();
  },

  reset() {
    state = seedState();
    emit();
  },
};
