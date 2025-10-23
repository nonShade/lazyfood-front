type Preferences = {
  diet?: string;
  allergies?: string[];
  likes?: string[];
};

let prefs: Preferences = {
  diet: 'Omnívora',
  allergies: ['Sin alergias'],
  likes: [],
};

type Listener = (p: Preferences) => void;
const listeners: Listener[] = [];

export const getPreferences = (): Preferences => ({ ...prefs });

export const setPreferences = (next: Preferences) => {
  prefs = { ...prefs, ...next };
  listeners.forEach(l => l(getPreferences()));
};

export const subscribePreferences = (cb: Listener) => {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

export default {
  getPreferences,
  setPreferences,
  subscribePreferences,
};