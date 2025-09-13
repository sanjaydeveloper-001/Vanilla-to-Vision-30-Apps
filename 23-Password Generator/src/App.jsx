import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Download,
  Upload,
  Search,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

// ---------- Utility helpers ----------
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMS = "0123456789";
const SYMBOLS = "!@#$%^&*()_-+={[}]|:;\"'<>,.?/";
const AMBIGUOUS = "O0oIl1|5S2Z"; // characters some users may want to avoid

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(str) {
  const a = str.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join("");
}

function calculateStrength(pw) {
  if (!pw) return { score: 0, label: "Empty", tips: ["Generate a password"], color: "bg-red-500" };

  let score = 0;
  const rules = [
    /[a-z]/.test(pw),
    /[A-Z]/.test(pw),
    /\d/.test(pw),
    /[^\w\s]/.test(pw),
    pw.length >= 12,
    pw.length >= 16,
  ];
  score = rules.filter(Boolean).length;

  let label = "Weak";
  let color = "bg-red-500";
  if (score >= 5) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score >= 3) {
    label = "Medium";
    color = "bg-yellow-500";
  }

  const tips = [];
  if (!/[a-z]/.test(pw)) tips.push("Add lowercase letters");
  if (!/[A-Z]/.test(pw)) tips.push("Add uppercase letters");
  if (!/\d/.test(pw)) tips.push("Add numbers");
  if (!/[^\w\s]/.test(pw)) tips.push("Add symbols");
  if (pw.length < 12) tips.push("Increase length (12+ recommended)");

  const percent = Math.min(100, Math.round((score / 6) * 100));
  return { score, label, tips, percent, color };
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

// ---------- Component ----------
export default function PasswordVault() {
  const [options, setOptions] = useLocalStorage("pv-options", {
    length: 16,
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: true,
    requireEachType: true,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const [entry, setEntry] = useState({ site: "", username: "", password: "" });
  const [vault, setVault] = useLocalStorage("pv-vault", []);
  const [revealMap, setRevealMap] = useState({});
  const [query, setQuery] = useState("");

  const fileInputRef = useRef(null);

  const filteredVault = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vault;
    return vault.filter(
      (v) => v.site.toLowerCase().includes(q) || v.username.toLowerCase().includes(q)
    );
  }, [query, vault]);

  function characterPool() {
    let pool = "";
    if (options.lower) pool += LOWER;
    if (options.upper) pool += UPPER;
    if (options.numbers) pool += NUMS;
    if (options.symbols) pool += SYMBOLS;
    if (options.avoidAmbiguous) {
      pool = pool
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }
    return pool || LOWER;
  }

  function generatePassword() {
    const pool = characterPool();
    const length = Math.max(4, Math.min(64, Number(options.length) || 12));

    let pw = "";

    const buckets = [];
    if (options.requireEachType && options.lower) buckets.push(LOWER);
    if (options.requireEachType && options.upper) buckets.push(UPPER);
    if (options.requireEachType && options.numbers) buckets.push(NUMS);
    if (options.requireEachType && options.symbols) buckets.push(SYMBOLS);

    for (const b of buckets) {
      let char = b[randomInt(b.length)];
      if (options.avoidAmbiguous) {
        while (AMBIGUOUS.includes(char)) char = b[randomInt(b.length)];
      }
      pw += char;
    }

    for (let i = pw.length; i < length; i++) {
      pw += pool[randomInt(pool.length)];
    }

    pw = shuffle(pw);
    setPassword(pw);
    setEntry((e) => ({ ...e, password: pw }));
    setCopied(false);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  function saveEntry() {
    if (!entry.site.trim() || !entry.username.trim() || !entry.password.trim()) return;
    const newItem = {
      id: crypto.randomUUID(),
      site: entry.site.trim(),
      username: entry.username.trim(),
      password: entry.password,
      createdAt: new Date().toISOString(),
    };
    setVault([newItem, ...vault]);
    setEntry({ site: "", username: "", password: "" });
  }

  function remove(id) {
    setVault(vault.filter((v) => v.id !== id));
  }

  function toggleReveal(id) {
    setRevealMap((m) => ({ ...m, [id]: !m[id] }));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(vault, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `password-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data)) setVault(data.concat(vault));
      } catch {}
    };
    reader.readAsText(file);
  }

  const strength = useMemo(() => calculateStrength(password), [password]);

  useEffect(() => {
    if (!password) generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-lg"
            >
              <Lock className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Password Vault</h1>
              <p className="text-sm opacity-70">Generate, store, and manage strong passwords locally.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportJSON}
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border border-zinc-300 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border border-zinc-300 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Import</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => importJSON(e.target.files?.[0])}
              />
            </button>
          </div>
        </div>

        {/* Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-200 bg-white backdrop-blur p-4 sm:p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Left: Controls */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Password length: <span className="opacity-70">{options.length}</span>
                </label>
                <input
                  type="range"
                  min={4}
                  max={64}
                  value={options.length}
                  onChange={(e) => setOptions({ ...options, length: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "lower", label: "Lowercase (a-z)" },
                  { key: "upper", label: "Uppercase (A-Z)" },
                  { key: "numbers", label: "Numbers (0-9)" },
                  { key: "symbols", label: "Symbols (!@#)" },
                  { key: "avoidAmbiguous", label: "Avoid ambiguous" },
                  { key: "requireEachType", label: "Require each type" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[opt.key]}
                      onChange={(e) => setOptions({ ...options, [opt.key]: e.target.checked })}
                      className="size-4 accent-indigo-500 cursor-pointer"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={generatePassword}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[.98] transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate
                </button>
                <button
                  onClick={() => copy(password)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-zinc-300 hover:shadow-md transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{strength.label}</span>
                </div>
              </div>
            </div>

            {/* Right: Output */}
            <div className="md:w-[46%] space-y-4">
              <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50 font-mono text-sm select-all overflow-x-auto whitespace-nowrap">
                {password}
              </div>

              <div>
                <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                  <motion.div
                    className={`h-2 ${strength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.percent || 10}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                  />
                </div>
                <div className="mt-2 text-xs opacity-75 flex flex-wrap gap-2">
                  {strength.tips.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-zinc-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Save form */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  placeholder="Website / App"
                  value={entry.site}
                  onChange={(e) => setEntry({ ...entry, site: e.target.value })}
                  className="rounded-xl px-3 py-2 bg-white border border-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  placeholder="Username / Email"
                  value={entry.username}
                  onChange={(e) => setEntry({ ...entry, username: e.target.value })}
                  className="rounded-xl px-3 py-2 bg-white border border-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2 w-full">
                  <input
                    placeholder="Password"
                    value={entry.password}
                    onChange={(e) => setEntry({ ...entry, password: e.target.value })}
                    className="flex-1 rounded-xl px-3 py-2 bg-white border border-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={saveEntry}
                    className="rounded-xl px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vault List */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-zinc-200 bg-white backdrop-blur p-4 sm:p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Saved credentials</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  placeholder="Search site or username"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 rounded-xl px-3 py-2 bg-white border border-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <AnimatePresence>
              {filteredVault.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm opacity-70"
                >
                  No saved credentials yet. Add some using the form above.
                </motion.div>
              )}

              {filteredVault.map((v) => (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-zinc-200 p-3 sm:p-4 bg-zinc-50 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{v.site}</div>
                    <div className="text-xs opacity-70 truncate">{v.username}</div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="px-2 py-1 rounded-md bg-zinc-200">
                      {revealMap[v.id] ? v.password : "•".repeat(Math.min(12, v.password.length))}
                    </span>
                    <button
                      onClick={() => toggleReveal(v.id)}
                      className="p-2 rounded-lg border border-zinc-300 hover:shadow cursor-pointer"
                      aria-label={revealMap[v.id] ? "Hide password" : "Show password"}
                    >
                      {revealMap[v.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copy(v.password)}
                      className="p-2 rounded-lg border border-zinc-300 hover:shadow cursor-pointer"
                      aria-label="Copy password"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(v.id)}
                      className="p-2 rounded-lg border border-zinc-300 text-red-600 hover:shadow cursor-pointer"
                      aria-label="Delete password"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <p className="text-center text-zinc-500 text-sm pt-4">
        Made with ❤️ by Sanjay
      </p>
    </div>
  );
}
