import { describe, it, expect, beforeEach } from 'vitest';
import {
  store,
  parseStored,
  isValidState,
  seedState,
  STORAGE_KEY,
} from './store.js';
import { CORPORATE_GOALS, KPI_REPORTS, CURRENT_USER } from './seed.js';

describe('store CRUD', () => {
  beforeEach(() => {
    store.reset();
  });

  it('seeds from the demo data on reset', () => {
    expect(store.getUser().email).toBe(CURRENT_USER.email);
    const state = parseStored(localStorage.getItem(STORAGE_KEY));
    expect(state.corporateGoals).toHaveLength(CORPORATE_GOALS.length);
    expect(state.kpiReports).toHaveLength(KPI_REPORTS.length);
  });

  it('addReport prepends a record with a generated id and the current user', () => {
    const before = parseStored(localStorage.getItem(STORAGE_KEY)).kpiReports.length;
    const rec = store.addReport({
      kpi_name: 'Test KPI',
      department: 'IT',
      reporting_period: 'Q3 2026',
      percentage: 88,
      notes: '',
    });
    expect(rec.id).toMatch(/^kr_/);
    expect(rec.created_by).toBe(CURRENT_USER.email);
    expect(rec.submitted_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const reports = parseStored(localStorage.getItem(STORAGE_KEY)).kpiReports;
    expect(reports).toHaveLength(before + 1);
    expect(reports[0].id).toBe(rec.id); // newest first
  });

  it('deleteReport removes a report by id', () => {
    const rec = store.addReport({
      kpi_name: 'Doomed',
      department: 'IT',
      reporting_period: 'Q3 2026',
      percentage: 50,
      notes: '',
    });
    store.deleteReport(rec.id);
    const ids = parseStored(localStorage.getItem(STORAGE_KEY)).kpiReports.map((r) => r.id);
    expect(ids).not.toContain(rec.id);
  });

  it('addCorporateGoal applies sensible defaults', () => {
    const rec = store.addCorporateGoal({
      title: 'New goal',
      category: 'Growth',
      kpi: 'Some KPI',
      current_percentage: 42,
      owner: 'Corporate',
    });
    expect(rec.id).toMatch(/^cg_/);
    expect(rec.target_percentage).toBe(100);
    expect(rec.trend).toEqual([42]);
  });

  it('updateCorporateGoal patches an existing goal immutably', () => {
    const first = parseStored(localStorage.getItem(STORAGE_KEY)).corporateGoals[0];
    store.updateCorporateGoal(first.id, { current_percentage: 12 });
    const updated = parseStored(localStorage.getItem(STORAGE_KEY)).corporateGoals.find(
      (g) => g.id === first.id
    );
    expect(updated.current_percentage).toBe(12);
    // untouched goals keep their values
    expect(parseStored(localStorage.getItem(STORAGE_KEY)).corporateGoals).toHaveLength(
      CORPORATE_GOALS.length
    );
  });

  it('deleteCorporateGoal removes a goal by id', () => {
    const target = parseStored(localStorage.getItem(STORAGE_KEY)).corporateGoals[0];
    store.deleteCorporateGoal(target.id);
    const ids = parseStored(localStorage.getItem(STORAGE_KEY)).corporateGoals.map((g) => g.id);
    expect(ids).not.toContain(target.id);
  });

  it('setRole switches the active role and persists it', () => {
    store.setRole('manager');
    expect(store.getUser().role).toBe('manager');
    expect(parseStored(localStorage.getItem(STORAGE_KEY)).user.role).toBe('manager');
  });

  it('mutations persist so a fresh load would rehydrate them', () => {
    store.addReport({
      kpi_name: 'Persisted KPI',
      department: 'Finance',
      reporting_period: 'Q3 2026',
      percentage: 77,
      notes: 'keep me',
    });
    // Simulate a page reload: re-parse exactly what load() would read.
    const rehydrated = parseStored(localStorage.getItem(STORAGE_KEY));
    expect(rehydrated.kpiReports.some((r) => r.kpi_name === 'Persisted KPI')).toBe(true);
  });
});

describe('storage resilience (parseStored / isValidState)', () => {
  it('rejects malformed JSON', () => {
    expect(parseStored('{not json')).toBeNull();
  });

  it('rejects structurally invalid state (missing collections)', () => {
    expect(parseStored(JSON.stringify({ user: { role: 'admin' } }))).toBeNull();
    expect(parseStored(JSON.stringify({ foo: 'bar' }))).toBeNull();
    expect(parseStored('null')).toBeNull();
    expect(parseStored('')).toBeNull();
  });

  it('accepts a well-formed seed state', () => {
    const good = JSON.stringify(seedState());
    expect(parseStored(good)).not.toBeNull();
    expect(isValidState(seedState())).toBe(true);
  });
});
