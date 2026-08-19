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

const STORAGE_KEY = 'performance-tracker.v1';

function seedState() {
  return {
    user: { ...CURRENT_USER },
    corporateGoals: CORPORATE_GOALS.map((g) => ({ ...g })),
    departmentalGoals: DEPARTMENTAL_GOALS.map((g) => ({ ...g })),
    businessSegments: BUSINESS_SEGMENTS.map((s) => ({ ...s })),
    kpiReports: KPI_REPORTS.map((r) => ({ ...r })),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore corrupt storage and reseed
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
