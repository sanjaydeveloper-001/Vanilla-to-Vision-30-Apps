import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const uid = () => Math.random().toString(36).slice(2, 9);

// Helper: dates
const todayISO = () => new Date().toISOString().slice(0, 10);

// Initial demo data
const sampleHabits = [
  {
    id: uid(),
    title: "Read 20 mins",
    color: "bg-amber-400",
    streak: 0,
    history: {}, // { '2025-09-15': true }
    createdAt: todayISO(),
  },
  {
    id: uid(),
    title: "Morning Walk",
    color: "bg-cyan-400",
    streak: 0,
    history: {},
    createdAt: todayISO(),
  },
];

// Badge rules
const badges = [
  { id: "bronze7", title: "7-day streak", need: 7, emoji: "🥉" },
  { id: "silver14", title: "14-day streak", need: 14, emoji: "🥈" },
  { id: "gold30", title: "30-day streak", need: 30, emoji: "🏆" },
];

export default function App() {
  const [habits, setHabits] = useState(() => {
    try {
      const raw = localStorage.getItem("habit_horizon_v1");
      return raw ? JSON.parse(raw) : sampleHabits;
    } catch (e) {
      return sampleHabits;
    }
  });

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [dark, setDark] = useState(() => {
    const raw = localStorage.getItem("habit_horizon_theme");
    return raw ? raw === "dark" : false;
  });
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    localStorage.setItem("habit_horizon_v1", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("habit_horizon_theme", dark ? "dark" : "light");
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // Utilities
  const addHabit = (payload) => {
    const newH = { id: uid(), streak: 0, history: {}, ...payload, createdAt: todayISO() };
    setHabits((s) => [newH, ...s]);
  };
  const updateHabit = (id, patch) => {
    setHabits((s) => s.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };
  const removeHabit = (id) => setHabits((s) => s.filter((h) => h.id !== id));

  const toggleDone = (habitId, date = selectedDate) => {
    setHabits((s) =>
      s.map((h) => {
        if (h.id !== habitId) return h;
        const history = { ...(h.history || {}) };
        if (history[date]) delete history[date];
        else history[date] = true;
        const streak = computeStreak(history, date);
        return { ...h, history, streak };
      })
    );
  };

  // compute continuous streak ending at date
  const computeStreak = (history, date) => {
    let count = 0;
    const d = new Date(date);
    while (true) {
      const iso = d.toISOString().slice(0, 10);
      if (history && history[iso]) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  };

  // derived
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return habits.filter((h) => h.title.toLowerCase().includes(q));
  }, [habits, query]);

  const earnedBadges = useMemo(() => {
    const set = new Set();
    habits.forEach((h) => {
      badges.forEach((b) => {
        if ((h.streak || 0) >= b.need) set.add(b.id);
      });
    });
    return [...set];
  }, [habits]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Header
          query={query}
          setQuery={setQuery}
          onAdd={() => {
            setEditing(null);
            setShowForm(true);
          }}
          dark={dark}
          setDark={setDark}
          onShowBadges={() => setShowBadges(true)}
          earnedCount={earnedBadges.length}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Habits</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Track daily, build streaks, stay consistent.</p>
                </div>
                <div className="flex items-center gap-3">
                  <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
              </motion.div>

              <div className="space-y-4">
                <AnimatePresence>
                  {filtered.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
                    >
                      <p className="text-gray-600 dark:text-gray-300">
                        No habits yet — create one to start building momentum!
                      </p>
                    </motion.div>
                  )}

                  {filtered.map((h) => (
                    <HabitCard
                      key={h.id}
                      habit={h}
                      selectedDate={selectedDate}
                      onToggle={() => toggleDone(h.id, selectedDate)}
                      onEdit={() => {
                        setEditing(h);
                        setShowForm(true);
                      }}
                      onDelete={() => removeHabit(h.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Quick Stats</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat title="Habits" value={habits.length} />
                <Stat title="Badges" value={earnedBadges.length} />
                <Stat title="Today" value={habits.filter((h) => (h.history || {})[selectedDate]).length} />
                <Stat title="Total Checks" value={Object.values(habits).reduce((acc, h) => acc + Object.keys(h.history || {}).length, 0)} />
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700"
                >
                  + New Habit
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Motivation</h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">"Small habits — big results. Keep doing it for 5 minutes more today."</p>
              <div className="mt-4">
                <ProgressSparkline habits={habits} />
              </div>
            </motion.div>
          </aside>
        </div>

        <AnimatePresence>
          {showForm && (
            <HabitForm
              onClose={() => setShowForm(false)}
              onSave={(payload) => {
                if (editing) updateHabit(editing.id, payload);
                else addHabit(payload);
                setShowForm(false);
              }}
              initial={editing}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBadges && (
            <BadgesModal onClose={() => setShowBadges(false)} earnedBadges={earnedBadges} />
          )}
        </AnimatePresence>
      </div>
      <p className="text-center text-white text-sm pb-5">
        Made with ❤️ by Sanjay
      </p>
    </div>
  );
}

function Header({ query, setQuery, onAdd, dark, setDark, onShowBadges, earnedCount }) {
  return (
    <header className="flex sm:flex-row flex-col sm:items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#6366f1" strokeWidth="1.5" />
            <path d="M8 12h8M8 7h8M8 17h8" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Habit Horizon</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">29th Day App Challenge — Habit Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search habits..."
            className="px-3 py-2 w-56 md:w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm"
          />
        </div>

        <button
          onClick={onShowBadges}
          className="text-white relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
        >
          Badges
          {earnedCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-amber-400 text-black">{earnedCount}</span>
          )}
        </button>

        {/* <button
          onClick={() => setDark((d) => !d)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          {dark ? "Light" : "Dark"}
        </button> */}

      </div>
    </header>
  );
}

function DatePicker({ selectedDate, setSelectedDate }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={selectedDate}
        readOnly={true}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm"
      />
    </div>
  );
}

function HabitCard({ habit, selectedDate, onToggle, onEdit, onDelete }) {
  const done = (habit.history || {})[selectedDate];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${habit.color}`}>
          <span className="font-semibold">{habit.title[0]}</span>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-100">{habit.title}</h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-300">
            <div className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="1.2" />
              </svg>
              <span>{habit.streak || 0} day streak</span>
            </div>
            <span>•</span>
            <span>Created {habit.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-lg font-medium ${done ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"}`}
        >
          {done ? "Done" : "Mark"}
        </button>

        <button onClick={onEdit} className="text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          Edit
        </button>
        <button onClick={onDelete} className="px-3 py-2 rounded-lg border border-red-200 text-red-600">
          Delete
        </button>
      </div>
    </motion.div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100">{value}</div>
    </div>
  );
}

function HabitForm({ onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [color, setColor] = useState(initial?.color || "bg-indigo-400");

  useEffect(() => {
    setTitle(initial?.title || "");
    setColor(initial?.color || "bg-indigo-400");
  }, [initial]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        className="absolute top-[25%] sm:top-0 sm:m-0 sm:relative w-[90%] sm:w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{initial ? "Edit Habit" : "New Habit"}</h3>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-600 dark:text-gray-300">Title</label>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className="text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />

          <label className="text-sm text-gray-600 dark:text-gray-300">Color</label>
          <div className="flex gap-2">
            {[
              "bg-indigo-400",
              "bg-rose-400",
              "bg-emerald-400",
              "bg-amber-400",
              "bg-cyan-400",
            ].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-lg ${c} ${color === c ? "ring-4 ring-offset-2 ring-indigo-300" : ""}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 mt-3">
            {initial && (
              <button
                onClick={() => {
                  onSave({ title, color });
                }}
                className="text-white px-4 py-2 rounded-lg border border-gray-200"
              >
                Save
              </button>
            )}

            {!initial && (
              <button
                onClick={() => {
                  if (!title.trim()) return alert("Please give a title");
                  onSave({ title: title.trim(), color });
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Create
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BadgesModal({ onClose, earnedBadges }) {
  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Badges</h3>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div key={b.id} className={`p-4 rounded-lg border ${earnedBadges.includes(b.id) ? "bg-amber-50 dark:bg-amber-900/30 border-amber-200" : "bg-white dark:bg-gray-900 border-gray-100"}`}>
              <div className="text-3xl">{b.emoji}</div>
              <div className="mt-2 font-semibold">{b.title}</div>
              <div className="text-sm text-gray-500">Need {b.need} day streak</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgressSparkline({ habits }) {
  // create a small inline sparkline showing total checks per day for last 10 days
  const days = 10;
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const val = habits.reduce((acc, h) => acc + ((h.history || {})[iso] ? 1 : 0), 0);
    arr.push(val);
  }
  const max = Math.max(...arr, 1);
  const points = arr.map((v, idx) => `${(idx / (arr.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-24">
      <polyline fill="none" strokeWidth="2" stroke="#6366f1" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* End of file */
