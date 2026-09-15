import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gps_timer_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

/**
 * GPS Stabilization timer backed by localStorage.
 * Keeps running across navigation and app switches because elapsed
 * time is computed from a stored start timestamp, not an in-memory counter.
 *
 * State: { startTime, pausedElapsedMs, targetSeconds, completed }
 */
export function useGpsTimer(targetMinutes = 2) {
  const targetSeconds = targetMinutes * 60;
  const [stored, setStored] = useState(() => loadState());
  const [now, setNow] = useState(Date.now());

  // Tick every second for smooth UI updates
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Sync when tab regains focus, storage changes in another tab, or external reset
  useEffect(() => {
    const sync = () => {
      setStored(loadState());
      setNow(Date.now());
    };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('storage', sync);
    window.addEventListener('gps-timer-reset', sync);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('gps-timer-reset', sync);
    };
  }, []);

  // Derive current values from stored state + current time
  let elapsedMs = 0;
  let isRunning = false;
  let isComplete = false;
  let isStarted = false;

  if (stored) {
    isStarted = true;
    if (stored.completed) {
      isComplete = true;
      elapsedMs = targetSeconds * 1000;
    } else if (stored.startTime != null) {
      isRunning = true;
      elapsedMs = now - stored.startTime;
      if (elapsedMs >= targetSeconds * 1000) {
        isComplete = true;
        elapsedMs = targetSeconds * 1000;
      }
    } else {
      // Paused
      elapsedMs = stored.pausedElapsedMs || 0;
    }
  }

  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const remainingSeconds = Math.max(targetSeconds - elapsedSeconds, 0);
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  // Persist completion when detected
  useEffect(() => {
    if (isComplete && stored && !stored.completed) {
      const newState = { ...stored, completed: true, startTime: null, pausedElapsedMs: targetSeconds * 1000 };
      saveState(newState);
      setStored(newState);
    }
  }, [isComplete, stored, targetSeconds]);

  const start = useCallback(() => {
    const newState = { startTime: Date.now(), pausedElapsedMs: 0, targetSeconds, completed: false };
    saveState(newState);
    setStored(newState);
    setNow(Date.now());
  }, [targetSeconds]);

  const pause = useCallback(() => {
    const current = loadState();
    if (!current || current.startTime == null) return;
    const elapsed = Date.now() - current.startTime;
    const newState = { ...current, startTime: null, pausedElapsedMs: elapsed };
    saveState(newState);
    setStored(newState);
  }, []);

  const resume = useCallback(() => {
    const current = loadState();
    if (!current || current.startTime != null || current.completed) return;
    const newState = { ...current, startTime: Date.now() - (current.pausedElapsedMs || 0), pausedElapsedMs: 0 };
    saveState(newState);
    setStored(newState);
    setNow(Date.now());
  }, []);

  const reset = useCallback(() => {
    saveState(null);
    setStored(null);
  }, []);

  const completeNow = useCallback(() => {
    const newState = { startTime: null, pausedElapsedMs: targetSeconds * 1000, targetSeconds, completed: true };
    saveState(newState);
    setStored(newState);
  }, [targetSeconds]);

  return {
    elapsedSeconds,
    remainingSeconds,
    progress,
    isComplete,
    isRunning,
    isStarted,
    start,
    pause,
    resume,
    reset,
    completeNow,
    targetSeconds,
  };
}

/** Reset the GPS timer state (clears localStorage). */
export function resetGpsTimer() {
  saveState(null);
  window.dispatchEvent(new CustomEvent('gps-timer-reset'));
}

/** Check if the GPS timer is complete (reads localStorage directly). */
export function isGpsTimerComplete() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (state.completed) return true;
    if (state.startTime != null) {
      const elapsed = (Date.now() - state.startTime) / 1000;
      return elapsed >= state.targetSeconds;
    }
    return false;
  } catch {
    return false;
  }
}