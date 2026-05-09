import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Force dark always on document root
const applyDark = () => document.documentElement.classList.add('dark');

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',

      setTheme: (theme) => {
        set({ theme: 'dark' });
        applyDark();
      },

      toggleTheme: () => {
        // Always stay dark
        applyDark();
      },

      initializeTheme: () => {
        applyDark();
        set({ theme: 'dark' });
      },
    }),
    { name: 'theme-storage' }
  )
);

export default useThemeStore;
