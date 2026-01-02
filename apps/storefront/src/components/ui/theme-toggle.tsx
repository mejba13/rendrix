'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '@/lib/theme-provider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'switch' | 'button' | 'dropdown';
}

export function ThemeToggle({ className, showLabel = false, variant = 'switch' }: ThemeToggleProps) {
  const { theme, setTheme, isDark } = useDarkMode();

  // Simple toggle between light and dark
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (variant === 'switch') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-300',
          isDark
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
            : 'bg-gradient-to-r from-amber-400 to-orange-500',
          className
        )}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Track decorations */}
        <span className="absolute inset-0 overflow-hidden rounded-full">
          {/* Stars for dark mode */}
          <AnimatePresence>
            {isDark && (
              <>
                <motion.span
                  className="absolute left-2 top-1.5 h-1 w-1 rounded-full bg-white/60"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.span
                  className="absolute left-4 top-2.5 h-0.5 w-0.5 rounded-full bg-white/40"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.span
                  className="absolute left-3 top-4 h-0.5 w-0.5 rounded-full bg-white/50"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.25 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Clouds for light mode */}
          <AnimatePresence>
            {!isDark && (
              <motion.span
                className="absolute right-2 top-2 h-2 w-4 rounded-full bg-white/30"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: 0.15 }}
              />
            )}
          </AnimatePresence>
        </span>

        {/* Toggle knob */}
        <motion.span
          className={cn(
            'relative flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-colors',
            isDark ? 'bg-slate-900' : 'bg-white'
          )}
          animate={{
            x: isDark ? 24 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-3.5 w-3.5 text-indigo-300" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.span>
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
          isDark
            ? 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
            : 'bg-amber-100 text-amber-600 hover:bg-amber-200',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // Dropdown variant with three options
  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300',
          isDark
            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            : 'bg-[var(--theme-muted)] text-[var(--theme-foreground)] hover:bg-[var(--theme-muted)]/80'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Moon className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Sun className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
        {showLabel && (
          <span className="text-sm font-medium">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}
      </motion.button>
    </div>
  );
}

// Compact toggle for mobile
export function ThemeToggleCompact({ className }: { className?: string }) {
  const { isDark, setTheme } = useDarkMode();

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        isDark
          ? 'text-indigo-300 hover:bg-slate-800'
          : 'text-amber-500 hover:bg-amber-50',
        className
      )}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
