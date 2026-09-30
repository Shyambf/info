// ==========================================
// SCHEDULE APPLICATION JAVASCRIPT
// Optimized for Mobile & Desktop
// With Single-Day Customization (Date Overrides)
// & Subjects Catalog in Edit Mode
// & SHA-256 Hashed Password Verification
// & Dark / Light Theme Support
// ==========================================

// --- CRYPTOGRAPHIC SHA-256 IMPLEMENTATION ---
function jsSha256(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j, result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] + (w[i] = i < 16 ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

async function computeSha256(str) {
  if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
    try {
      const enc = new TextEncoder().encode(str);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    } catch(e) {
      // fallback to pure JS below
    }
  }
  return jsSha256(str);
}

// SHA-256 hash of password:
const PIN_HASH = "2926b0a47dfea0a2f0fd3d43130dc8245cf63242d23e628e57c0619921fdb280";

// --- GLOBAL CONFIGURATION & DATA ---
const times = [
  "8.00 - 9.35",
  "9.50-11.25",
  "11.40-13.15",
  "14.00-15.35",
  "15.50-17.25",
  "17.40-19.15",
  "19.25-21.00"
];

const dayNames = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
const shortDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Semester configuration:
// "начали с 2 недели с 1 сентября" -> Monday 31.08.2026 = Week 2 (even weeks from anchor).
const SEMESTER_CONFIG = {
  refMonday: new Date(2026, 7, 31), // 31.08.2026
  startDate: new Date(2026, 8, 1),   // 01.09.2026
  endDate: new Date(2026, 11, 31)
};

// Initial Lessons Dataset (Template for 1st and 2nd week)
const defaultLessons = [
  { id: 0, slot: 1, subject: "Методы машинного обучения", teacher: "Кокин В.М.", room: "Б324", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 1, slot: 8, subject: "Обработка и анализ данных", teacher: "Ратманова И.Д.", room: "Б014", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 2, slot: 10, subject: "Технологии гибридных суперкомпьютерных вычислений", teacher: "Чернышева Л.П.", room: "Б326", type: "seminar", isOnline: false, notes: "", customTime: "" },
  { id: 3, slot: 16, subject: "Архитектура систем искусственного интеллекта", teacher: "ХХ", room: "Б310", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 4, slot: 17, subject: "Инструментальные средства для систем искусственного интеллекта", teacher: "Алыкова А.Л.", room: "Б017", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 5, slot: 21, subject: "Упр. жизн. циклом ПО", teacher: "Садыков А.М.", room: "Б014", type: "seminar", isOnline: false, notes: "", customTime: "" },
  { id: 6, slot: 23, subject: "Упр. жизн. циклом ПО", teacher: "Садыков А.М.", room: "Б310", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 7, slot: 25, subject: "Методы машинного обучения", teacher: "Кокин В.М.", room: "Б318", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 8, slot: 28, subject: "Упр. жизн. циклом ПО", teacher: "Садыков А.М.", room: "Б306", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 9, slot: 32, subject: "Обработка и анализ данных", teacher: "Ратманова И.Д.", room: "Б306", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 10, slot: 50, subject: "Технологии гибридных суперкомпьютерных вычислений", teacher: "Чернышева Л.П.", room: "Б331(2)", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 11, slot: 51, subject: "Инструментальные средства для систем искусственного интеллекта", teacher: "Алыкова А.Л.", room: "Б306", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 12, slot: 57, subject: "Обработка и анализ данных", teacher: "Ратманова И.Д.", room: "Б014", type: "seminar", isOnline: false, notes: "", customTime: "" },
  { id: 13, slot: 58, subject: "Мет. научн. исслед.", teacher: "Пантелеев Е.Р.", room: "Б306", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 14, slot: 65, subject: "Мет. научн. исслед.", teacher: "Пантелеев Е.Р.", room: "Б326", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 15, slot: 66, subject: "Технологии гибридных суперкомпьютерных вычислений", teacher: "Чернышева Л.П.", room: "Б310", type: "lecture", isOnline: false, notes: "", customTime: "" },
  { id: 16, slot: 73, subject: "Мет. научн. исслед.", teacher: "Пантелеев Е.Р.", room: "Б310", type: "seminar", isOnline: false, notes: "", customTime: "" },
  { id: 17, slot: 80, subject: "Методы машинного обучения", teacher: "Кокин В.М.", room: "Б324", type: "lab", isOnline: false, notes: "", customTime: "" },
  { id: 18, slot: 87, subject: "Архитектура систем искусственного интеллекта", teacher: "Нечаев В.А.", room: "Б306", type: "lab", isOnline: false, notes: "", customTime: "" }
];

// Catalog of unique subjects without duplicates (all default to lecture)
const defaultSubjectsCatalog = [
  { id: "subj_1", name: "Методы машинного обучения", teacher: "Кокин В.М.", room: "Б318", type: "lecture", isOnline: false },
  { id: "subj_2", name: "Обработка и анализ данных", teacher: "Ратманова И.Д.", room: "Б014", type: "lecture", isOnline: false },
  { id: "subj_3", name: "Технологии гибридных суперкомпьютерных вычислений", teacher: "Чернышева Л.П.", room: "Б310", type: "lecture", isOnline: false },
  { id: "subj_4", name: "Архитектура систем искусственного интеллекта", teacher: "Нечаев В.А.", room: "Б310", type: "lecture", isOnline: false },
  { id: "subj_5", name: "Инструментальные средства для систем искусственного интеллекта", teacher: "Алыкова А.Л.", room: "Б017", type: "lecture", isOnline: false },
  { id: "subj_6", name: "Упр. жизн. циклом ПО", teacher: "Садыков А.М.", room: "Б310", type: "lecture", isOnline: false },
  { id: "subj_7", name: "Мет. научн. исслед.", teacher: "Пантелеев Е.Р.", room: "Б326", type: "lecture", isOnline: false }
];

// State variables
let lessons = JSON.parse(JSON.stringify(defaultLessons));
let dateOverrides = {}; // { [dateKey: "YYYY-MM-DD"]: Array of custom lesson objects }
let subjectsCatalog = JSON.parse(JSON.stringify(defaultSubjectsCatalog));

let isEditMode = false;
let currentView = 'grid'; // 'grid' | 'month'
let gridSubMode = (window.innerWidth <= 768) ? 'day' : 'day';
let gridWeekMode = 'calendar'; // 'calendar' (exact date) | 'week1' | 'week2' (template)
let selectedSubjectHighlight = null;

// Date & Navigation state
const todayDate = new Date();
let currentMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
let selectedCalendarDate = new Date(todayDate);
let dayViewMonday = getMonday(todayDate);
let selectedGridDayOfWeek = (todayDate.getDay() + 6) % 7; // 0=Mon..6=Sun
let selectedGridWeek = getSemesterWeekForDate(todayDate);

// Firebase Realtime Database URL: Injected via GitHub Actions secret FIREBASE_URL or loaded from localStorage
const INJECTED_FIREBASE_URL = "__FIREBASE_URL_PLACEHOLDER__";
const DEFAULT_FIREBASE_URL = (INJECTED_FIREBASE_URL && !INJECTED_FIREBASE_URL.startsWith("__"))
  ? INJECTED_FIREBASE_URL
  : (localStorage.getItem("schedule_cloud_url") || "");
let cloudDatabaseUrl = localStorage.getItem("schedule_cloud_url") || DEFAULT_FIREBASE_URL;

function getCloudEndpoint() {
  if (!cloudDatabaseUrl) return "";
  let base = cloudDatabaseUrl.trim().replace(/\/+$/, '');
  return base.endsWith(".json") ? base : `${base}/schedule.json`;
}

// --- DATE HELPER FUNCTIONS ---
function getMonday(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getSemesterWeekForDate(date) {
  const targetMonday = getMonday(date);
  const refMonday = new Date(SEMESTER_CONFIG.refMonday);
  refMonday.setHours(0, 0, 0, 0);
  const msPerWeek = 7 * 86400000;
  const diffWeeks = Math.round((targetMonday.getTime() - refMonday.getTime()) / msPerWeek);
  // diffWeeks = 0 is Week 2 (Sep 1, 2026 week)
  // Even diffWeeks -> Week 2, Odd diffWeeks -> Week 1
  return (Math.abs(diffWeeks) % 2 === 0) ? 2 : 1;
}

function formatDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateKey(key) {
  if (!key) return new Date();
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateRu(d) {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} г.`;
}

function getMonthShort(mIdx) {
  return ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][mIdx];
}

function getMonthGenitive(mIdx) {
  return ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"][mIdx];
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// Time sorting helper (supports custom time like "10:00 - 11:30")
function getLessonMinutes(l) {
  const str = l.customTime || (l.timeIndex !== undefined && times[l.timeIndex] ? times[l.timeIndex] : "");
  if (str) {
    const m = str.match(/(\d{1,2})[:.](\d{2})/);
    if (m) {
      return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
  }
  return (l.timeIndex !== undefined && l.timeIndex >= 0) ? (l.timeIndex * 100) : 9999;
}

function getLessonTimeDisplay(l) {
  if (l.customTime && l.customTime.trim()) {
    return l.customTime.trim();
  }
  const tIdx = l.timeIndex !== undefined ? l.timeIndex : (l.slot !== undefined ? Math.floor((l.slot % 49) / 7) : 0);
  return times[tIdx] || "";
}

function getLessonPairNumberDisplay(l) {
  const tIdx = l.timeIndex !== undefined ? l.timeIndex : (l.slot !== undefined ? Math.floor((l.slot % 49) / 7) : -1);
  if (tIdx >= 0 && tIdx < 7 && (!l.customTime || l.customTime === times[tIdx])) {
    return `${tIdx + 1} пара • `;
  }
  return "";
}

// --- DATA ACCESS: SINGLE-DAY OVERRIDES & RECURRING TEMPLATES ---
function hasDateOverride(date) {
  const key = formatDateKey(date);
  return !!(dateOverrides && dateOverrides[key] !== undefined);
}

function getLessonsForDate(date) {
  const key = formatDateKey(date);

  // 1. If this exact date has been overridden / customized:
  if (dateOverrides && dateOverrides[key] !== undefined) {
    return JSON.parse(JSON.stringify(dateOverrides[key])).map((l, idx) => ({
      ...l,
      timeIndex: (l.timeIndex !== undefined) ? l.timeIndex : (l.slot !== undefined ? Math.floor((l.slot % 49) / 7) : idx),
      customTime: l.customTime || "",
      isOverride: true,
      dateKey: key
    })).sort((a, b) => getLessonMinutes(a) - getLessonMinutes(b));
  }

  // 2. Otherwise, fallback to the default recurring 2-week timetable:
  const weekNum = getSemesterWeekForDate(date);
  const dayOfWeek = (date.getDay() + 6) % 7;

  const templateLessons = lessons.filter(l => {
    if (l.slot === null || isNaN(l.slot)) return false;
    const lWeek = Math.floor(l.slot / 49) + 1;
    const lDay = (l.slot % 49) % 7;
    return lWeek === weekNum && lDay === dayOfWeek;
  }).map(l => ({
    ...l,
    timeIndex: Math.floor((l.slot % 49) / 7),
    customTime: l.customTime || "",
    isOverride: false,
    dateKey: key
  }));

  templateLessons.sort((a, b) => getLessonMinutes(a) - getLessonMinutes(b));
  return JSON.parse(JSON.stringify(templateLessons));
}

function getTemplateLessons(weekNum, dayOfWeek) {
  const list = lessons.filter(l => {
    if (l.slot === null || isNaN(l.slot)) return false;
    const lWeek = Math.floor(l.slot / 49) + 1;
    const lDay = (l.slot % 49) % 7;
    return lWeek === weekNum && lDay === dayOfWeek;
  }).map(l => ({
    ...l,
    timeIndex: Math.floor((l.slot % 49) / 7),
    customTime: l.customTime || "",
    isOverride: false
  }));
  list.sort((a, b) => getLessonMinutes(a) - getLessonMinutes(b));
  return list;
}

// --- INITIALIZATION ---
window.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  updateCurrentWeekIndicator();
  buildGrid();
  loadLocalState();
  await checkUrlParamsForAuth();

  if (cloudDatabaseUrl) {
    const cloudInput = document.getElementById("cloud-db-url");
    if (cloudInput) cloudInput.value = cloudDatabaseUrl;
    await fetchFromCloud();
    initRealtimeListener();
  }

  switchGridSubMode(gridSubMode);
  selectGridMode(gridWeekMode);
  renderAllViews();
});

// --- THEME MANAGEMENT (DARK / LIGHT) ---
function initTheme() {
  const savedTheme = localStorage.getItem("schedule_theme");
  let theme = savedTheme;
  if (!theme) {
    theme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  applyTheme(theme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark-theme");
  applyTheme(isDark ? "light" : "dark");
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("schedule_theme", theme);

  const icon = document.getElementById("theme-icon");
  const text = document.getElementById("theme-text");
  if (icon) icon.innerText = isDark ? "☀️" : "🌙";
  if (text) text.innerText = isDark ? "Светлая" : "Тёмная";
}

function updateCurrentWeekIndicator() {
  const currentWeek = getSemesterWeekForDate(new Date());
  const indicator = document.getElementById("current-week-indicator");
  if (indicator) {
    const dayName = shortDays[(new Date().getDay() + 6) % 7];
    indicator.innerText = `${currentWeek} нед • ${dayName}, ${new Date().getDate()} ${getMonthShort(new Date().getMonth())}`;
  }
}

// --- CLOUD SYNC & LOCAL PERSISTENCE ---
function loadLocalState() {
  const savedLessons = localStorage.getItem("schedule_lessons_data");
  if (savedLessons) {
    try {
      const parsed = JSON.parse(savedLessons);
      if (Array.isArray(parsed)) {
        lessons = parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.lessons)) lessons = parsed.lessons;
        if (parsed.dateOverrides) dateOverrides = parsed.dateOverrides;
        if (Array.isArray(parsed.subjectsCatalog)) subjectsCatalog = parsed.subjectsCatalog;
      }
    } catch(e) {
      console.warn("Could not parse saved lessons", e);
    }
  }

  const savedOverrides = localStorage.getItem("schedule_date_overrides");
  if (savedOverrides) {
    try {
      dateOverrides = JSON.parse(savedOverrides);
    } catch(e) {
      console.warn("Could not parse saved overrides", e);
    }
  }

  const savedCatalog = localStorage.getItem("schedule_subjects_catalog");
  if (savedCatalog) {
    try {
      subjectsCatalog = JSON.parse(savedCatalog);
    } catch(e) {
      console.warn("Could not parse subjects catalog", e);
    }
  }

  // Clean up any legacy #data= hash from URL if present
  if (window.location.hash.startsWith("#data=")) {
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch(e) {}
  }
}

function saveLocalState() {
  localStorage.setItem("schedule_lessons_data", JSON.stringify(lessons));
  localStorage.setItem("schedule_date_overrides", JSON.stringify(dateOverrides));
  localStorage.setItem("schedule_subjects_catalog", JSON.stringify(subjectsCatalog));
}

async function fetchFromCloud() {
  const url = getCloudEndpoint();
  if (!url) return;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data === null) {
        console.log("Firebase is empty, seeding with default schedule...");
        await saveToCloud();
      } else if (Array.isArray(data)) {
        lessons = data;
        dateOverrides = {};
        saveLocalState();
        renderAllViews();
        showToast("Синхронизировано с базой данных ☁️");
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.lessons)) {
          lessons = data.lessons;
        }
        if (data.dateOverrides && typeof data.dateOverrides === 'object') {
          dateOverrides = data.dateOverrides;
        } else {
          dateOverrides = {};
        }
        if (Array.isArray(data.subjectsCatalog)) {
          subjectsCatalog = data.subjectsCatalog;
        }
        saveLocalState();
        renderAllViews();
        showToast("Синхронизировано с базой данных ☁️");
      }
    }
  } catch (err) {
    console.warn("Cloud fetch error:", err);
  }
}

async function saveToCloud() {
  const url = getCloudEndpoint();
  if (!url) return false;
  try {
    const payload = {
      lessons: lessons,
      dateOverrides: dateOverrides || {},
      subjectsCatalog: subjectsCatalog || []
    };
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn("Cloud save error:", err);
    return false;
  }
}

function initRealtimeListener() {
  const url = getCloudEndpoint();
  if (!url || typeof EventSource === "undefined") return;
  try {
    const eventSource = new EventSource(url);
    eventSource.addEventListener("put", (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (!payload || !payload.data || isEditMode) return;
        const data = payload.data;
        if (Array.isArray(data)) {
          lessons = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.lessons)) lessons = data.lessons;
          if (data.dateOverrides && typeof data.dateOverrides === 'object') {
            dateOverrides = data.dateOverrides;
          }
          if (Array.isArray(data.subjectsCatalog)) {
            subjectsCatalog = data.subjectsCatalog;
          }
        }
        saveLocalState();
        renderAllViews();
        showToast("Расписание обновлено 🔄");
      } catch(err) {
        // ignore
      }
    });
  } catch(err) {
    console.warn("EventSource error:", err);
  }
}

function saveCloudConfig() {
  const url = document.getElementById("cloud-db-url").value.trim();
  cloudDatabaseUrl = url;
  localStorage.setItem("schedule_cloud_url", url);
  showToast("URL облака сохранен!");
  if (url) {
    saveToCloud();
  }
}

async function testCloudConnection() {
  saveCloudConfig();
  if (!cloudDatabaseUrl) {
    alert("Укажите URL базы данных Firebase");
    return;
  }
  showToast("Проверка связи...");
  const success = await saveToCloud();
  if (success) {
    alert("Успешно! Расписание подключено к облачной базе.");
  } else {
    alert("Не удалось подключиться к облаку. Проверьте адрес и правила доступа (read/write: true).");
  }
}

// --- EDIT MODE & HASHED SECURITY ---
async function checkUrlParamsForAuth() {
  const params = new URLSearchParams(window.location.search);
  const editParam = params.get("edit");
  const hash = window.location.hash;

  let candidate = editParam;
  if (!candidate && hash.includes("edit=")) {
    const m = hash.match(/edit=([^&]+)/);
    if (m) candidate = m[1];
  }

  if (candidate) {
    if (candidate === PIN_HASH) {
      enterEditMode();
    } else {
      const hashed = await computeSha256(candidate);
      if (hashed === PIN_HASH) {
        enterEditMode();
      }
    }
  }
}

function handleEditModeButton() {
  if (isEditMode) {
    exitEditMode();
  } else {
    openModal('pin-modal');
    const input = document.getElementById("input-pin");
    if (input) {
      input.value = "";
      input.focus();
    }
    const err = document.getElementById("pin-error");
    if (err) err.style.display = "none";
  }
}

async function verifyPin() {
  const val = document.getElementById("input-pin").value.trim();
  const err = document.getElementById("pin-error");
  const hashed = await computeSha256(val);

  if (hashed === PIN_HASH) {
    closeModal('pin-modal');
    enterEditMode();
    showToast("Режим редактирования активирован 🔓");
  } else {
    if (err) {
      err.style.display = "block";
      err.innerText = "Неверный пароль. Попробуйте еще раз.";
    }
  }
}

function enterEditMode() {
  isEditMode = true;
  document.body.classList.add("edit-mode-active");

  const btn = document.getElementById("btn-edit-mode-toggle");
  if (btn) {
    btn.innerHTML = `🔓 <span class="btn-text">Выйти</span>`;
    btn.classList.add("btn-danger");
    btn.classList.remove("btn-primary");
  }

  const banner = document.getElementById("edit-banner");
  if (banner) banner.style.display = "flex";

  renderAllViews();
}

function exitEditMode() {
  isEditMode = false;
  document.body.classList.remove("edit-mode-active");

  const btn = document.getElementById("btn-edit-mode-toggle");
  if (btn) {
    btn.innerHTML = `🔒 <span class="btn-text">Редактор</span>`;
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-primary");
  }

  const banner = document.getElementById("edit-banner");
  if (banner) banner.style.display = "none";

  toggleSidebar(false);
  renderAllViews();
  showToast("Вы вышли из режима редактирования");
}

async function saveAllChanges() {
  saveLocalState();
  showToast("Сохранение в облако...");
  const ok = await saveToCloud();
  if (ok) {
    showToast("Все изменения сохранены в облаке ☁️");
  } else {
    showToast("Сохранено локально (проверьте подключение)");
  }
  renderAllViews();
}

function resetToDefault() {
  if (confirm("Сбросить все изменения (шаблоны, предметы и точечные дни) к исходному расписанию?")) {
    lessons = JSON.parse(JSON.stringify(defaultLessons));
    dateOverrides = {};
    subjectsCatalog = JSON.parse(JSON.stringify(defaultSubjectsCatalog));
    saveLocalState();
    saveToCloud();
    renderAllViews();
    showToast("Расписание сброшено к исходному");
  }
}

function clearScheduleAll() {
  if (confirm("Вы уверены, что хотите полностью очистить всё расписание (удалить все пары из шаблона и с конкретных дат), чтобы заполнить расписание своей группы с нуля?")) {
    lessons = [];
    dateOverrides = {};
    saveLocalState();
    saveToCloud();
    renderAllViews();
    showToast("Расписание очищено. Теперь вы можете заполнить его с нуля! 📝");
  }
}

// --- GENERAL VIEW RENDERING ---
function renderAllViews() {
  renderSidebarCards();
  renderGridLessons();
  renderDayByDayView();
  renderMonthCalendar();
}

function switchView(viewName) {
  currentView = viewName;

  const btnGrid = document.getElementById("tab-btn-grid");
  const btnMonth = document.getElementById("tab-btn-month");
  if (btnGrid) btnGrid.classList.toggle("active", viewName === 'grid');
  if (btnMonth) btnMonth.classList.toggle("active", viewName === 'month');

  const viewGrid = document.getElementById("view-grid");
  const viewMonth = document.getElementById("view-month");

  if (viewGrid) viewGrid.style.display = (viewName === 'grid') ? 'flex' : 'none';
  if (viewMonth) viewMonth.style.display = (viewName === 'month') ? 'flex' : 'none';

  if (viewName === 'grid') {
    switchGridSubMode(gridSubMode);
  } else if (viewName === 'month') {
    renderMonthCalendar();
  }
}

function switchGridSubMode(mode) {
  if (window.innerWidth <= 768) {
    mode = 'day';
  }
  gridSubMode = mode;
  const dayBtn = document.getElementById("btn-subtab-day");
  const tableBtn = document.getElementById("btn-subtab-table");
  const dayView = document.getElementById("day-by-day-view");
  const tableOuter = document.getElementById("table-wrapper-outer");

  if (dayBtn) dayBtn.classList.toggle("active", mode === 'day');
  if (tableBtn) tableBtn.classList.toggle("active", mode === 'table');

  if (mode === 'day') {
    if (dayView) dayView.style.display = 'flex';
    if (tableOuter) tableOuter.style.display = 'none';
    renderDayByDayView();
  } else {
    if (dayView) dayView.style.display = 'none';
    if (tableOuter) tableOuter.style.display = 'block';
    renderGridLessons();
  }
}

function openBaseScheduleTemplate(weekNum = 1) {
  if (currentView !== 'grid') {
    switchView('grid');
  }
  selectGridMode(weekNum === 2 ? 'week2' : 'week1');
  const targetElem = document.getElementById("day-by-day-view") || document.getElementById("view-grid");
  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function selectGridMode(mode) {
  gridWeekMode = mode;

  const pillCal = document.getElementById("week-pill-calendar");
  const pill1 = document.getElementById("week-pill-1");
  const pill2 = document.getElementById("week-pill-2");
  const weekNav = document.getElementById("day-view-week-nav");
  const templateBanner = document.getElementById("template-info-banner");

  if (pillCal) pillCal.classList.toggle("active", mode === 'calendar');
  if (pill1) pill1.classList.toggle("active", mode === 'week1');
  if (pill2) pill2.classList.toggle("active", mode === 'week2');

  if (mode === 'calendar') {
    if (weekNav) weekNav.style.display = 'flex';
    if (templateBanner) templateBanner.style.display = 'none';
  } else {
    if (weekNav) weekNav.style.display = 'none';
    selectedGridWeek = (mode === 'week1') ? 1 : 2;
    if (templateBanner) {
      templateBanner.style.display = 'flex';
      const parityName = (selectedGridWeek === 1) ? 'нечётная' : 'чётная';
      const bannerTitle = document.getElementById("template-banner-title");
      const bannerDesc = document.getElementById("template-banner-desc");
      if (bannerTitle) bannerTitle.innerText = `Базовое расписание: ${selectedGridWeek}-я (${parityName}) неделя`;
      if (bannerDesc) bannerDesc.innerText = `Пары, добавленные здесь, автоматически распространяются на каждую ${parityName} неделю с сентября по декабрь.`;
    }
  }

  renderDayByDayView();
}

function changeDayViewWeek(delta) {
  dayViewMonday = new Date(dayViewMonday.getFullYear(), dayViewMonday.getMonth(), dayViewMonday.getDate() + delta * 7);
  renderDayByDayView();
}

function goToDayViewToday() {
  dayViewMonday = getMonday(new Date());
  selectedGridDayOfWeek = (new Date().getDay() + 6) % 7;
  renderDayByDayView();
}

function selectGridDayOfWeek(dayIdx) {
  selectedGridDayOfWeek = dayIdx;
  renderDayByDayView();
}

// --- DAY-BY-DAY (MOBILE & DESKTOP) VIEW ---
function renderDayByDayView() {
  const strip = document.getElementById("day-selector-strip");
  const header = document.getElementById("day-cards-header");
  const container = document.getElementById("day-lessons-container");
  const weekTitle = document.getElementById("day-view-week-title");

  if (!strip || !container) return;
  strip.innerHTML = "";

  if (gridWeekMode === 'calendar') {
    // 1. CALENDAR DATE MODE (Exact dates with point overrides)
    const sundayDate = new Date(dayViewMonday.getFullYear(), dayViewMonday.getMonth(), dayViewMonday.getDate() + 6);
    const weekNum = getSemesterWeekForDate(dayViewMonday);

    if (weekTitle) {
      weekTitle.innerText = `${dayViewMonday.getDate()} ${getMonthShort(dayViewMonday.getMonth())} – ${sundayDate.getDate()} ${getMonthShort(sundayDate.getMonth())} (${weekNum} неделя)`;
    }

    shortDays.forEach((dName, dIdx) => {
      const date = new Date(dayViewMonday.getFullYear(), dayViewMonday.getMonth(), dayViewMonday.getDate() + dIdx);
      const dayLessons = getLessonsForDate(date);
      const count = dayLessons.length;
      const hasOv = hasDateOverride(date);
      const isToday = isSameDay(date, new Date());

      const btn = document.createElement("button");
      btn.className = `day-strip-btn ${dIdx === selectedGridDayOfWeek ? 'active' : ''} ${isToday ? 'is-today' : ''}`;
      btn.innerHTML = `
        <span class="strip-day-name">${dName}</span>
        <span class="strip-day-date">${date.getDate()} ${getMonthShort(date.getMonth())}</span>
        <span class="day-strip-count ${hasOv ? 'has-override-badge' : ''}">${hasOv ? '⚡ ' : ''}${count > 0 ? count + ' пар' : '—'}</span>
      `;
      btn.addEventListener("click", () => selectGridDayOfWeek(dIdx));
      strip.appendChild(btn);
    });

    const targetDate = new Date(dayViewMonday.getFullYear(), dayViewMonday.getMonth(), dayViewMonday.getDate() + selectedGridDayOfWeek);
    const dateKey = formatDateKey(targetDate);
    const hasOv = hasDateOverride(targetDate);
    const dayLessons = getLessonsForDate(targetDate);
    const targetWeekNum = getSemesterWeekForDate(targetDate);

    if (header) {
      header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
          <div>
            <strong>📅 ${capitalizeFirstLetter(dayNames[selectedGridDayOfWeek])}, ${targetDate.getDate()} ${getMonthGenitive(targetDate.getMonth())}</strong>
            <span style="font-size: 11.5px; color: var(--text-muted); margin-left: 6px;">(${targetWeekNum} неделя)</span>
            ${hasOv ? `<span class="badge-override" style="margin-left: 6px;">⚡ Точечное расписание</span>` : ''}
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${isEditMode && hasOv ? `<button class="btn btn-outline btn-sm" onclick="resetDayToTemplate('${dateKey}')">↺ К шаблону</button>` : ''}
            ${isEditMode ? `<button class="btn btn-primary btn-sm" onclick="openAddLessonForDateModal('${dateKey}')">+ Добавить пару</button>` : ''}
          </div>
        </div>
      `;
    }

    renderLessonCardsIntoContainer(container, dayLessons, dateKey, true);

  } else {
    // 2. TEMPLATE MODE (Week 1 or Week 2 base schedule)
    shortDays.forEach((dName, dIdx) => {
      const templateLessons = getTemplateLessons(selectedGridWeek, dIdx);
      const count = templateLessons.length;

      const btn = document.createElement("button");
      btn.className = `day-strip-btn ${dIdx === selectedGridDayOfWeek ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="strip-day-name">${dName}</span>
        <span class="day-strip-count">${count > 0 ? count + ' пар' : '—'}</span>
      `;
      btn.addEventListener("click", () => selectGridDayOfWeek(dIdx));
      strip.appendChild(btn);
    });

    const templateLessons = getTemplateLessons(selectedGridWeek, selectedGridDayOfWeek);

    if (header) {
      const parityName = (selectedGridWeek === 1) ? 'нечётная' : 'чётная';
      header.innerHTML = `
        <div class="template-header-card">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-main);">
                📋 ${capitalizeFirstLetter(dayNames[selectedGridDayOfWeek])} • ${selectedGridWeek}-я неделя (${parityName})
              </div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                Базовый шаблон: эти пары автоматически повторяются каждую ${parityName} неделю всего семестра
              </div>
            </div>
            ${isEditMode ? `<button class="btn btn-primary btn-sm" onclick="openAddLessonModalForSelectedDay()">+ Добавить пару в шаблон</button>` : ''}
          </div>
        </div>
      `;
    }

    renderLessonCardsIntoContainer(container, templateLessons, null, false);
  }
}

function renderLessonCardsIntoContainer(container, dayLessons, dateKey, isCalendarMode) {
  container.innerHTML = "";

  if (dayLessons.length === 0) {
    container.innerHTML = `
      <div class="empty-day-state">
        <div style="font-size: 28px; margin-bottom: 6px;">🎉</div>
        <strong>${isCalendarMode ? 'Занятий нет' : 'В базовом расписании пока нет пар на этот день'}</strong>
        <p style="font-size: 12px; margin-top: 4px; color: var(--text-muted);">
          ${isCalendarMode ? 'Свободный день' : 'Добавьте пары сюда, и они автоматически заполнятся на все недели семестра'}
        </p>
        ${isEditMode ? (
          isCalendarMode 
            ? `<button class="btn btn-outline btn-sm" style="margin-top: 10px;" onclick="openAddLessonForDateModal('${dateKey}')">+ Добавить пару на этот день</button>`
            : `<button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="openAddLessonModalForSelectedDay()">+ Добавить пару в базовое расписание</button>`
        ) : ''}
      </div>
    `;
    return;
  }

  dayLessons.forEach(l => {
    const timeDisplay = getLessonTimeDisplay(l);
    const pairNumDisplay = getLessonPairNumberDisplay(l);
    const typeLabel = l.type === 'lab' ? 'Лабораторная' : (l.type === 'seminar' ? 'Семинар' : 'Лекция');

    const card = document.createElement("div");
    card.className = `mobile-lesson-card type-${l.type}`;
    if (selectedSubjectHighlight === l.subject) {
      card.style.borderColor = "var(--primary)";
      card.style.boxShadow = "0 0 0 2px var(--primary-glow)";
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="mobile-card-time">🕒 ${pairNumDisplay}${timeDisplay}</span>
        <span class="card-type-badge type-${l.type}">${typeLabel}</span>
      </div>
      <div class="mobile-card-title">${escapeHtml(l.subject)}</div>
      <div class="mobile-card-teacher">👤 ${escapeHtml(l.teacher || 'Преподаватель не указан')}</div>
      <div class="mobile-card-meta">
        ${l.isOnline ? '<span class="badge-online">🌐 Дистант</span>' : ''}
        <span class="badge-room">🏫 ${escapeHtml(l.room || 'Каб. не указан')}</span>
        ${l.notes ? `<span class="badge-slot-info">📝 ${escapeHtml(l.notes)}</span>` : ''}
      </div>
      ${isEditMode ? `
        <div style="display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
          <button class="btn btn-outline btn-sm" style="flex:1;" onclick="event.stopPropagation(); ${
            isCalendarMode ? `openEditLessonForDateModal('${dateKey}', ${JSON.stringify(l).replace(/"/g, '&quot;')})` : `openEditModalForId(${l.id})`
          }">✏️ Изменить</button>
          <button class="btn btn-outline btn-sm" style="color:#ef4444;" onclick="event.stopPropagation(); ${
            isCalendarMode ? `cancelLessonForDate('${dateKey}', ${l.timeIndex}, '${l.id}')` : `deleteLesson(${l.id})`
          }" title="${isCalendarMode ? 'Отменить на этот день' : 'Удалить из шаблона'}">🗑️</button>
        </div>
      ` : ''}
    `;

    card.addEventListener("click", () => {
      if (isEditMode) {
        if (isCalendarMode) {
          openEditLessonForDateModal(dateKey, l);
        } else {
          openEditModalForId(l.id);
        }
      }
    });

    container.appendChild(card);
  });
}

// --- 2-WEEK FULL GRID VIEW ---
function buildGrid() {
  const tbody = document.getElementById("schedule-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  [1, 2].forEach(week => {
    times.forEach((timeStr, tIdx) => {
      const tr = document.createElement("tr");

      if (tIdx === 0) {
        const tdWeek = document.createElement("td");
        tdWeek.rowSpan = times.length;
        tdWeek.className = "week-cell col-week";
        tdWeek.innerText = `${week} нед`;
        tr.appendChild(tdWeek);
      }

      const tdTime = document.createElement("td");
      tdTime.className = "col-time";
      tdTime.innerHTML = `<strong>${tIdx + 1}</strong><br><small style="color:var(--text-muted);">${timeStr}</small>`;
      tr.appendChild(tdTime);

      dayNames.forEach((dName, dIdx) => {
        const td = document.createElement("td");
        const slotIdx = (week - 1) * 49 + tIdx * 7 + dIdx;
        td.dataset.slot = slotIdx;
        td.className = "schedule-slot";

        if (dIdx >= 5) td.classList.add("weekend");

        td.addEventListener("click", () => handleSlotClick(slotIdx));
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  });
}

function renderGridLessons() {
  document.querySelectorAll(".schedule-slot").forEach(td => {
    td.innerHTML = "";
    td.className = "schedule-slot" + (parseInt(td.dataset.slot, 10) % 7 >= 5 ? " weekend" : "");
  });

  lessons.forEach(lesson => {
    if (lesson.slot === null || isNaN(lesson.slot)) return;
    const td = document.querySelector(`.schedule-slot[data-slot="${lesson.slot}"]`);
    if (!td) return;

    td.classList.add(`type-${lesson.type}`);
    if (selectedSubjectHighlight === lesson.subject) {
      td.classList.add("highlighted-cell");
    }

    const typeLabel = lesson.type === 'lab' ? 'Лаба' : (lesson.type === 'seminar' ? 'Сем' : 'Лек');

    td.innerHTML = `
      <div class="slot-content">
        <div class="slot-subject">${escapeHtml(lesson.subject)}</div>
        <div class="slot-teacher">${escapeHtml(lesson.teacher || '')}</div>
        <div class="slot-badges">
          <span class="slot-type-badge">${typeLabel}</span>
          ${lesson.isOnline ? '<span class="badge-online">🌐 Дист</span>' : ''}
          <span class="badge-room">${escapeHtml(lesson.room || '')}</span>
          ${lesson.customTime ? `<span class="badge-slot-info" style="font-size:9px;">⏱️ ${escapeHtml(lesson.customTime)}</span>` : ''}
        </div>
      </div>
    `;
  });
}

// --- SIDEBAR CATALOG OF UNIQUE SUBJECTS (ONLY IN EDIT MODE) ---
function filterSidebarCards() {
  renderSidebarCards();
}

function renderSidebarCards() {
  const list = document.getElementById("sidebar-cards-list");
  if (!list) return;
  list.innerHTML = "";

  const query = (document.getElementById("sidebar-search")?.value || "").toLowerCase().trim();

  // Render unique subjects catalog (no duplicates)
  subjectsCatalog.forEach(subj => {
    if (query) {
      const match = (subj.name || "").toLowerCase().includes(query) ||
                    (subj.teacher || "").toLowerCase().includes(query) ||
                    (subj.room || "").toLowerCase().includes(query);
      if (!match) return;
    }

    const card = document.createElement("div");
    card.className = "sidebar-catalog-card";

    card.innerHTML = `
      <div class="catalog-card-header">
        <div class="catalog-subject-title">${escapeHtml(subj.name)}</div>
        <button class="btn btn-outline btn-sm" style="color:#ef4444; padding: 2px 6px;" onclick="deleteSubjectFromCatalog('${subj.id}')" title="Удалить предмет из каталога">✕</button>
      </div>
      <div class="catalog-teacher-name">👤 ${escapeHtml(subj.teacher || 'Преподаватель не указан')}</div>

      <div class="catalog-card-controls">
        <div class="catalog-control-row">
          <span>Тип:</span>
          <select class="catalog-select-sm" onchange="updateSubjectCatalogType('${subj.id}', this.value)">
            <option value="lecture" ${subj.type === 'lecture' ? 'selected' : ''}>Лекция</option>
            <option value="seminar" ${subj.type === 'seminar' ? 'selected' : ''}>Семинар</option>
            <option value="lab" ${subj.type === 'lab' ? 'selected' : ''}>Лабораторная</option>
          </select>
        </div>

        <div class="catalog-control-row">
          <span>Формат:</span>
          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 11.5px;">
            <input type="checkbox" ${subj.isOnline ? 'checked' : ''} onchange="updateSubjectCatalogOnline('${subj.id}', this.checked)">
            🌐 Дистант
          </label>
        </div>

        <div class="catalog-control-row">
          <span>Кабинет:</span>
          <input type="text" class="catalog-room-input" value="${escapeHtml(subj.room || '')}" placeholder="Кабинет" onchange="updateSubjectCatalogRoom('${subj.id}', this.value)">
        </div>
      </div>

      <div class="catalog-actions-row">
        <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="addLessonFromCatalog('${subj.id}')">
          + Поставить пару
        </button>
      </div>
    `;

    list.appendChild(card);
  });
}

function updateSubjectCatalogType(id, newType) {
  const item = subjectsCatalog.find(s => s.id === id);
  if (item) {
    item.type = newType;
    saveLocalState();
    saveToCloud();
    showToast(`Тип для «${item.name}» изменен на ${newType === 'lecture' ? 'лекцию' : (newType === 'seminar' ? 'семинар' : 'лабораторную')}`);
  }
}

function updateSubjectCatalogOnline(id, isOnline) {
  const item = subjectsCatalog.find(s => s.id === id);
  if (item) {
    item.isOnline = isOnline;
    saveLocalState();
    saveToCloud();
    showToast(`Формат для «${item.name}»: ${isOnline ? 'Дистант' : 'Очно'}`);
  }
}

function updateSubjectCatalogRoom(id, newRoom) {
  const item = subjectsCatalog.find(s => s.id === id);
  if (item) {
    item.room = newRoom.trim();
    saveLocalState();
    saveToCloud();
    showToast(`Кабинет для «${item.name}»: ${item.room || 'не указан'}`);
  }
}

function deleteSubjectFromCatalog(id) {
  const item = subjectsCatalog.find(s => s.id === id);
  if (!item) return;
  if (!confirm(`Удалить предмет «${item.name}» из каталога?`)) return;
  subjectsCatalog = subjectsCatalog.filter(s => s.id !== id);
  saveLocalState();
  saveToCloud();
  renderSidebarCards();
  showToast("Предмет удален из каталога");
}

function openAddSubjectToCatalogModal() {
  document.getElementById("new-subj-name").value = "";
  document.getElementById("new-subj-teacher").value = "";
  document.getElementById("new-subj-type").value = "lecture";
  document.getElementById("new-subj-room").value = "";
  document.getElementById("new-subj-online").checked = false;
  openModal('subject-modal');
}

function saveNewSubjectToCatalog() {
  const name = document.getElementById("new-subj-name").value.trim();
  const teacher = document.getElementById("new-subj-teacher").value.trim();
  const type = document.getElementById("new-subj-type").value;
  const room = document.getElementById("new-subj-room").value.trim();
  const isOnline = document.getElementById("new-subj-online").checked;

  if (!name) {
    alert("Укажите название предмета");
    return;
  }

  const newSubj = {
    id: "subj_" + Date.now(),
    name,
    teacher,
    type,
    room,
    isOnline
  };

  subjectsCatalog.push(newSubj);
  saveLocalState();
  saveToCloud();
  closeModal('subject-modal');
  renderSidebarCards();
  showToast(`Предмет «${name}» добавлен в список!`);
}

function addLessonFromCatalog(subjId) {
  const subj = subjectsCatalog.find(s => s.id === subjId);
  if (!subj) return;

  // If in Calendar mode, pre-fill current selected date
  if (gridWeekMode === 'calendar') {
    const targetDate = new Date(dayViewMonday.getFullYear(), dayViewMonday.getMonth(), dayViewMonday.getDate() + selectedGridDayOfWeek);
    const dateKey = formatDateKey(targetDate);
    openAddLessonForDateModal(dateKey, 0);
  } else {
    openAddLessonModal(null, selectedGridWeek, selectedGridDayOfWeek);
  }

  // Pre-fill subject parameters
  document.getElementById("edit-subject").value = subj.name;
  document.getElementById("edit-teacher").value = subj.teacher || "";
  document.getElementById("edit-type").value = subj.type || "lecture";
  document.getElementById("edit-room").value = subj.room || "";
  document.getElementById("edit-is-online").value = subj.isOnline ? "true" : "false";

  // If mobile, close sidebar drawer
  toggleSidebar(false);
}

function toggleSidebar(open) {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (sidebar) sidebar.classList.toggle("open", open);
  if (backdrop) backdrop.classList.toggle("open", open);
}

// --- MONTH CALENDAR VIEW (WITH POINT OVERRIDES) ---
function changeMonth(delta) {
  currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + delta, 1);
  renderMonthCalendar();
}

function goToToday() {
  currentMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  selectedCalendarDate = new Date(todayDate);
  renderMonthCalendar();
}

function renderMonthCalendar() {
  const container = document.getElementById("month-days-body");
  if (!container) return;
  container.innerHTML = "";

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  const monthDisplay = document.getElementById("current-month-display");
  if (monthDisplay) monthDisplay.innerText = `${monthNames[month]} ${year}`;

  const filterOverridesOnly = false;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();

  const today = new Date();

  // Previous month trailing days
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDate - i);
    renderCalendarDayCell(container, d, true, filterOverridesOnly, today);
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    renderCalendarDayCell(container, d, false, filterOverridesOnly, today);
  }

  // Next month leading days
  const totalCellsSoFar = startDayOfWeek + totalDays;
  const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    renderCalendarDayCell(container, d, true, filterOverridesOnly, today);
  }

  renderMonthSelectedDayDetails();
}

function renderCalendarDayCell(container, date, isOtherMonth, filterOverridesOnly, today) {
  const hasOv = hasDateOverride(date);
  if (filterOverridesOnly && !hasOv) return;

  const cell = document.createElement("div");
  cell.className = "calendar-day-cell";
  if (isOtherMonth) cell.classList.add("other-month");
  if (hasOv) cell.classList.add("has-override");

  const dayOfWeek = (date.getDay() + 6) % 7;
  if (dayOfWeek >= 5) cell.classList.add("weekend");

  const isToday = isSameDay(date, today);
  if (isToday) cell.classList.add("is-today");

  const isSelected = selectedCalendarDate && isSameDay(date, selectedCalendarDate);
  if (isSelected) cell.classList.add("is-selected");

  const weekNum = getSemesterWeekForDate(date);
  const dayLessons = getLessonsForDate(date);

  const top = document.createElement("div");
  top.className = "day-cell-top";
  top.innerHTML = `
    <span class="day-number">${date.getDate()}</span>
    <span class="day-week-badge">${weekNum} нед</span>
    ${hasOv ? '<span class="badge-override-mini" title="Точечные изменения на этот день">⚡</span>' : ''}
  `;
  cell.appendChild(top);

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "day-dots-container";
  dayLessons.forEach(l => {
    const dot = document.createElement("span");
    dot.className = `day-dot day-dot-${l.type}`;
    dotsContainer.appendChild(dot);
  });
  cell.appendChild(dotsContainer);

  const list = document.createElement("div");
  list.className = "day-lessons-list";

  dayLessons.forEach(l => {
    const pill = document.createElement("div");
    pill.className = `month-lesson-pill type-${l.type}`;
    const timeDisplay = getLessonTimeDisplay(l);
    const timeStart = timeDisplay.split('-')[0].trim();

    pill.innerHTML = `
      <strong>${timeStart}</strong> ${escapeHtml(l.subject)}
    `;

    list.appendChild(pill);
  });

  cell.appendChild(list);

  cell.addEventListener("click", () => {
    selectedCalendarDate = date;
    document.querySelectorAll(".calendar-day-cell").forEach(c => c.classList.remove("is-selected"));
    cell.classList.add("is-selected");
    renderMonthSelectedDayDetails();
  });

  container.appendChild(cell);
}

function renderMonthSelectedDayDetails() {
  const panel = document.getElementById("month-selected-day-panel");
  if (!panel) return;

  if (!selectedCalendarDate) {
    panel.innerHTML = "";
    return;
  }

  const d = selectedCalendarDate;
  const dateKey = formatDateKey(d);
  const dayOfWeek = (d.getDay() + 6) % 7;
  const weekNum = getSemesterWeekForDate(d);
  const fullDay = dayNames[dayOfWeek];
  const dateFormatted = `${d.getDate()} ${getMonthGenitive(d.getMonth())} ${d.getFullYear()} г.`;
  const hasOv = hasDateOverride(d);
  const dayLessons = getLessonsForDate(d);

  let lessonsHtml = "";
  if (dayLessons.length === 0) {
    lessonsHtml = `
      <div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 16px 0;">
        В этот день пар нет (выходной) 🎉
      </div>
    `;
  } else {
    lessonsHtml = dayLessons.map(l => {
      const timeDisplay = getLessonTimeDisplay(l);
      const pairNumDisplay = getLessonPairNumberDisplay(l);
      const typeLabel = l.type === 'lab' ? 'Лабораторная' : (l.type === 'seminar' ? 'Семинар' : 'Лекция');

      return `
        <div class="mobile-lesson-card type-${l.type}" style="margin-top:6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="mobile-card-time">🕒 ${pairNumDisplay}${timeDisplay}</span>
            <span class="card-type-badge type-${l.type}">${typeLabel}</span>
          </div>
          <div class="mobile-card-title">${escapeHtml(l.subject)}</div>
          <div class="mobile-card-teacher">👤 ${escapeHtml(l.teacher || 'Преподаватель не указан')}</div>
          <div class="mobile-card-meta">
            ${l.isOnline ? '<span class="badge-online">🌐 Дистант</span>' : ''}
            <span class="badge-room">🏫 ${escapeHtml(l.room || 'Каб. не указан')}</span>
            ${l.notes ? `<span class="badge-slot-info">📝 ${escapeHtml(l.notes)}</span>` : ''}
          </div>
          ${isEditMode ? `
            <div style="display: flex; gap: 8px; margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border-subtle);">
              <button class="btn btn-outline btn-sm" style="flex:1;" onclick="event.stopPropagation(); openEditLessonForDateModal('${dateKey}', ${JSON.stringify(l).replace(/"/g, '&quot;')})">✏️ Изменить</button>
              <button class="btn btn-outline btn-sm" style="color:#ef4444;" onclick="event.stopPropagation(); cancelLessonForDate('${dateKey}', ${l.timeIndex}, '${l.id}')">🗑️</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  }

  panel.innerHTML = `
    <div class="month-selected-header">
      <div>
        <strong>📅 ${dateFormatted}</strong>
        <div style="font-size: 11.5px; color: var(--text-muted); font-weight: normal; margin-top: 2px;">
          ${capitalizeFirstLetter(fullDay)} • ${weekNum} неделя
          ${hasOv ? '<span class="badge-override" style="margin-left: 6px;">⚡ Точечные изменения</span>' : ''}
        </div>
      </div>
      <div style="display: flex; gap: 6px; align-items: center;">
        ${isEditMode && hasOv ? `
          <button class="btn btn-outline btn-sm" onclick="resetDayToTemplate('${dateKey}')">↺ К шаблону</button>
        ` : ''}
        ${isEditMode ? `
          <button class="btn btn-primary btn-sm" onclick="openAddLessonForDateModal('${dateKey}')">+ Добавить</button>
        ` : ''}
      </div>
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
      ${lessonsHtml}
    </div>
  `;
}

// --- MODAL: POINT EDITING & RECURRING TEMPLATE EDITING ---
function handleStandardTimeSelect(val) {
  const customInput = document.getElementById("edit-custom-time");
  if (!customInput) return;
  if (val === 'custom') {
    customInput.focus();
  } else {
    const idx = parseInt(val, 10);
    if (!isNaN(idx) && times[idx]) {
      customInput.value = times[idx];
    }
  }
}

function toggleModalScopeUI() {
  const scope = document.querySelector('input[name="edit-target-scope"]:checked')?.value || 'template-both';
  const timingRow = document.getElementById("template-timing-row");
  const weekSelect = document.getElementById("edit-week");
  if (timingRow) {
    timingRow.style.display = (scope !== 'date') ? 'flex' : 'none';
  }
  if (weekSelect) {
    if (scope === 'template-both') {
      weekSelect.value = 'both';
      weekSelect.disabled = true;
    } else if (scope === 'template') {
      weekSelect.disabled = false;
      if (weekSelect.value === 'both') weekSelect.value = '1';
    } else {
      weekSelect.disabled = false;
    }
  }
}

function openAddLessonForDateModal(dateKey, defaultTimeIndex = 0) {
  if (!isEditMode) {
    showToast("Включите режим редактирования 🔒");
    handleEditModeButton();
    return;
  }

  const d = parseDateKey(dateKey);
  const weekNum = getSemesterWeekForDate(d);
  const dayIdx = (d.getDay() + 6) % 7;
  const parityName = (weekNum === 1) ? 'нечётная' : 'чётная';

  document.getElementById("modal-card-title").innerText = `Добавить пару (${formatDateRu(d)})`;
  document.getElementById("edit-lesson-id").value = "";
  document.getElementById("edit-target-date-str").value = dateKey;

  const scopeContainer = document.getElementById("edit-scope-container");
  if (scopeContainer) scopeContainer.style.display = "block";

  const scopeBothRadio = document.getElementById("scope-mode-template-both");
  const scopeTplRadio = document.getElementById("scope-mode-template");
  const scopeDateRadio = document.getElementById("scope-mode-date");

  if (scopeBothRadio) {
    scopeBothRadio.checked = true; // Default to adding to base recurring schedule for the whole semester!
    document.getElementById("scope-both-title").innerText = `🔄 В базовое расписание: каждую неделю (1 и 2 нед.)`;
  }
  if (scopeTplRadio) {
    document.getElementById("scope-template-title").innerText = `📋 В базовое расписание: через неделю (только ${weekNum} нед. - ${parityName})`;
  }
  if (scopeDateRadio) {
    document.getElementById("scope-date-title").innerText = `⚡ Разово только на эту дату (${formatDateRu(d)})`;
  }

  document.getElementById("edit-subject").value = "";
  document.getElementById("edit-teacher").value = "";
  document.getElementById("edit-type").value = "lecture";
  document.getElementById("edit-is-online").value = "false";
  document.getElementById("edit-room").value = "";
  document.getElementById("edit-notes").value = "";

  const weekSelect = document.getElementById("edit-week");
  if (weekSelect) weekSelect.value = "both";
  document.getElementById("edit-day").value = dayIdx;
  document.getElementById("edit-time").value = defaultTimeIndex;
  document.getElementById("edit-custom-time").value = times[defaultTimeIndex] || "";

  const delBtn = document.getElementById("btn-delete-card");
  if (delBtn) delBtn.style.display = "none";

  toggleModalScopeUI();
  openModal("card-modal");
}

function openEditLessonForDateModal(dateKey, lessonObj) {
  if (!isEditMode) {
    showToast("Включите режим редактирования 🔒");
    handleEditModeButton();
    return;
  }

  const d = parseDateKey(dateKey);
  const weekNum = getSemesterWeekForDate(d);
  const dayIdx = (d.getDay() + 6) % 7;
  const parityName = (weekNum === 1) ? 'нечётная' : 'чётная';

  document.getElementById("modal-card-title").innerText = `Редактировать пару (${formatDateRu(d)})`;
  document.getElementById("edit-lesson-id").value = lessonObj.id || "";
  document.getElementById("edit-target-date-str").value = dateKey;

  const scopeContainer = document.getElementById("edit-scope-container");
  if (scopeContainer) scopeContainer.style.display = "block";

  const isOverride = !!lessonObj.isOverride;

  const scopeBothRadio = document.getElementById("scope-mode-template-both");
  const scopeTplRadio = document.getElementById("scope-mode-template");
  const scopeDateRadio = document.getElementById("scope-mode-date");

  if (scopeBothRadio) {
    document.getElementById("scope-both-title").innerText = `🔄 В базовое расписание: каждую неделю (1 и 2 нед.)`;
  }
  if (scopeTplRadio) {
    document.getElementById("scope-template-title").innerText = `📋 В базовое расписание: только по ${weekNum} нед. (${parityName})`;
  }
  if (scopeDateRadio) {
    document.getElementById("scope-date-title").innerText = `⚡ Разово только на эту дату (${formatDateRu(d)})`;
  }

  if (isOverride) {
    if (scopeDateRadio) scopeDateRadio.checked = true;
  } else {
    // If it's a template lesson, default to saving to template so it propagates!
    if (scopeTplRadio) scopeTplRadio.checked = true;
  }

  document.getElementById("edit-subject").value = lessonObj.subject || "";
  document.getElementById("edit-teacher").value = lessonObj.teacher || "";
  document.getElementById("edit-type").value = lessonObj.type || "lecture";
  document.getElementById("edit-is-online").value = lessonObj.isOnline ? "true" : "false";
  document.getElementById("edit-room").value = lessonObj.room || "";
  document.getElementById("edit-notes").value = lessonObj.notes || "";

  const weekSelect = document.getElementById("edit-week");
  if (weekSelect) weekSelect.value = String(weekNum);
  document.getElementById("edit-day").value = dayIdx;

  const tIdx = lessonObj.timeIndex !== undefined ? lessonObj.timeIndex : 0;
  const customTimeVal = lessonObj.customTime || times[tIdx] || "";
  document.getElementById("edit-custom-time").value = customTimeVal;

  const matchIdx = times.indexOf(customTimeVal);
  if (matchIdx >= 0) {
    document.getElementById("edit-time").value = matchIdx;
  } else {
    document.getElementById("edit-time").value = "custom";
  }

  const delBtn = document.getElementById("btn-delete-card");
  if (delBtn) {
    delBtn.style.display = "block";
    delBtn.innerText = isOverride ? "Отменить разовую пару на этот день" : "Удалить из базового расписания";
    delBtn.onclick = () => {
      closeModal("card-modal");
      if (isOverride) {
        cancelLessonForDate(dateKey, lessonObj.timeIndex, lessonObj.id);
      } else {
        deleteLesson(lessonObj.id);
      }
    };
  }

  toggleModalScopeUI();
  openModal("card-modal");
}

function cancelLessonForDate(dateKey, timeIndex, lessonId) {
  if (!confirm(`Отменить эту пару на ${formatDateRu(parseDateKey(dateKey))}?`)) return;

  if (!dateOverrides[dateKey]) {
    const current = getLessonsForDate(parseDateKey(dateKey));
    dateOverrides[dateKey] = current.map(item => ({
      id: "ov_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      timeIndex: item.timeIndex,
      customTime: item.customTime || "",
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
      type: item.type,
      isOnline: item.isOnline,
      notes: item.notes
    }));
  }

  dateOverrides[dateKey] = dateOverrides[dateKey].filter(item => {
    if (lessonId && String(item.id) === String(lessonId)) return false;
    return item.timeIndex !== timeIndex;
  });

  saveAllChanges();
  renderAllViews();
  showToast("Пара отменена на этот день 🗑️");
}

function resetDayToTemplate(dateKey) {
  if (!confirm(`Сбросить все точечные изменения на ${formatDateRu(parseDateKey(dateKey))} и вернуть стандартное расписание недели?`)) return;

  if (dateOverrides[dateKey]) {
    delete dateOverrides[dateKey];
    saveAllChanges();
    renderAllViews();
    showToast("Расписание дня сброшено к шаблону недели ↺");
  }
}

function openAddLessonModalForSelectedDay() {
  if (gridWeekMode === 'calendar') {
    const targetDate = new Date(dayViewMonday.getFullYear(), dayViewMonday.getMonth(), dayViewMonday.getDate() + selectedGridDayOfWeek);
    openAddLessonForDateModal(formatDateKey(targetDate));
  } else {
    openAddLessonModal(null, selectedGridWeek, selectedGridDayOfWeek);
  }
}

function openAddLessonModal(defaultSlot = null, defaultWeek = null, defaultDay = null) {
  if (!isEditMode) {
    showToast("Включите режим редактирования 🔒");
    handleEditModeButton();
    return;
  }

  document.getElementById("modal-card-title").innerText = "Добавить пару в базовое расписание";
  document.getElementById("edit-lesson-id").value = "";
  document.getElementById("edit-target-date-str").value = "";

  const scopeContainer = document.getElementById("edit-scope-container");
  if (scopeContainer) scopeContainer.style.display = "none";

  let week = defaultWeek;
  let timeIdx = 0;
  let day = (defaultDay !== null) ? defaultDay : selectedGridDayOfWeek;

  if (defaultSlot !== null) {
    week = Math.floor(defaultSlot / 49) + 1;
    const within = defaultSlot % 49;
    timeIdx = Math.floor(within / 7);
    day = within % 7;
  } else if (week === null) {
    if (gridWeekMode === 'week1') week = "1";
    else if (gridWeekMode === 'week2') week = "2";
    else week = "both";
  }

  document.getElementById("edit-subject").value = "";
  document.getElementById("edit-teacher").value = "";
  document.getElementById("edit-type").value = "lecture";
  document.getElementById("edit-is-online").value = "false";
  document.getElementById("edit-room").value = "";
  document.getElementById("edit-notes").value = "";

  const weekSelect = document.getElementById("edit-week");
  if (weekSelect) {
    weekSelect.disabled = false;
    weekSelect.value = String(week);
  }
  document.getElementById("edit-day").value = day;
  document.getElementById("edit-time").value = timeIdx;
  document.getElementById("edit-custom-time").value = times[timeIdx] || "";

  const delBtn = document.getElementById("btn-delete-card");
  if (delBtn) delBtn.style.display = "none";

  const timingRow = document.getElementById("template-timing-row");
  if (timingRow) timingRow.style.display = 'flex';

  openModal("card-modal");
}

function openEditModalForId(id) {
  if (!isEditMode) {
    showToast("Включите режим редактирования 🔒");
    handleEditModeButton();
    return;
  }

  const lesson = lessons.find(l => String(l.id) === String(id));
  if (!lesson) return;

  document.getElementById("modal-card-title").innerText = "Редактировать пару (базовое расписание)";
  document.getElementById("edit-lesson-id").value = lesson.id;
  document.getElementById("edit-target-date-str").value = "";

  const scopeContainer = document.getElementById("edit-scope-container");
  if (scopeContainer) scopeContainer.style.display = "none";

  const timingRow = document.getElementById("template-timing-row");
  if (timingRow) timingRow.style.display = 'flex';

  document.getElementById("edit-subject").value = lesson.subject || "";
  document.getElementById("edit-teacher").value = lesson.teacher || "";
  document.getElementById("edit-type").value = lesson.type || "lecture";
  document.getElementById("edit-is-online").value = lesson.isOnline ? "true" : "false";
  document.getElementById("edit-room").value = lesson.room || "";
  document.getElementById("edit-notes").value = lesson.notes || "";

  let tIdx = 0;
  let week = 1;
  let day = 0;
  if (lesson.slot !== null && !isNaN(lesson.slot)) {
    week = Math.floor(lesson.slot / 49) + 1;
    const within = lesson.slot % 49;
    tIdx = Math.floor(within / 7);
    day = within % 7;
  }

  const weekSelect = document.getElementById("edit-week");
  if (weekSelect) {
    weekSelect.disabled = false;
    weekSelect.value = String(week);
  }
  document.getElementById("edit-day").value = day;

  const customTimeVal = lesson.customTime || times[tIdx] || "";
  document.getElementById("edit-custom-time").value = customTimeVal;

  const matchIdx = times.indexOf(customTimeVal);
  if (matchIdx >= 0) {
    document.getElementById("edit-time").value = matchIdx;
  } else {
    document.getElementById("edit-time").value = "custom";
  }

  const delBtn = document.getElementById("btn-delete-card");
  if (delBtn) {
    delBtn.style.display = "block";
    delBtn.innerText = "Удалить из базового расписания";
    delBtn.onclick = () => deleteCurrentLesson();
  }

  openModal("card-modal");
}

function handleSlotClick(slotIdx) {
  if (!isEditMode) return;
  const existing = lessons.find(l => l.slot === slotIdx);
  if (existing) {
    openEditModalForId(existing.id);
  } else {
    openAddLessonModal(slotIdx);
  }
}

function saveCardModal() {
  const scopeContainer = document.getElementById("edit-scope-container");
  const isScopeShown = scopeContainer && scopeContainer.style.display !== 'none';
  const scope = isScopeShown 
    ? (document.querySelector('input[name="edit-target-scope"]:checked')?.value || 'template-both') 
    : 'template';
  const targetDateKey = document.getElementById("edit-target-date-str").value;
  const idVal = document.getElementById("edit-lesson-id").value;

  const subject = document.getElementById("edit-subject").value.trim();
  const teacher = document.getElementById("edit-teacher").value.trim();
  const type = document.getElementById("edit-type").value;
  const isOnline = document.getElementById("edit-is-online").value === "true";
  const room = document.getElementById("edit-room").value.trim();
  const notes = document.getElementById("edit-notes").value.trim();

  const timeSelectVal = document.getElementById("edit-time").value;
  const customTimeVal = document.getElementById("edit-custom-time").value.trim();

  let timeIdx = parseInt(timeSelectVal, 10);
  if (isNaN(timeIdx) || timeSelectVal === 'custom') {
    const matchIdx = times.indexOf(customTimeVal);
    timeIdx = (matchIdx >= 0) ? matchIdx : 0;
  }

  if (!subject) {
    alert("Пожалуйста, укажите название предмета");
    return;
  }

  if (scope === 'date' && targetDateKey) {
    // 1. SPECIFIC DATE OVERRIDE (Single Day)
    if (!dateOverrides[targetDateKey]) {
      const current = getLessonsForDate(parseDateKey(targetDateKey));
      dateOverrides[targetDateKey] = current.map(item => ({
        id: "ov_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
        timeIndex: item.timeIndex,
        customTime: item.customTime || "",
        subject: item.subject,
        teacher: item.teacher,
        room: item.room,
        type: item.type,
        isOnline: item.isOnline,
        notes: item.notes
      }));
    }

    const existingIdx = dateOverrides[targetDateKey].findIndex(item => {
      if (idVal && String(item.id) === String(idVal)) return true;
      return item.timeIndex === timeIdx;
    });

    const newObj = {
      id: idVal || ("ov_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4)),
      timeIndex: timeIdx,
      customTime: customTimeVal,
      subject,
      teacher,
      room,
      type,
      isOnline,
      notes
    };

    if (existingIdx >= 0) {
      dateOverrides[targetDateKey][existingIdx] = newObj;
    } else {
      dateOverrides[targetDateKey].push(newObj);
    }

    dateOverrides[targetDateKey].sort((a, b) => getLessonMinutes(a) - getLessonMinutes(b));
    showToast(`Сохранено точечно на ${formatDateRu(parseDateKey(targetDateKey))} 💾`);
  } else {
    // 2. RECURRING BASE SCHEDULE TEMPLATE (Auto-propagates to all weeks!)
    let weekVal = document.getElementById("edit-week").value;
    if (scope === 'template-both') {
      weekVal = 'both';
    }

    const day = parseInt(document.getElementById("edit-day").value, 10);
    const weeksToUpdate = (weekVal === 'both') ? [1, 2] : [parseInt(weekVal, 10)];

    weeksToUpdate.forEach(w => {
      const slot = (w - 1) * 49 + timeIdx * 7 + day;

      let existing = null;
      if (idVal !== "") {
        existing = lessons.find(l => String(l.id) === String(idVal) && Math.floor(l.slot / 49) + 1 === w);
      }
      if (!existing) {
        existing = lessons.find(l => l.slot === slot);
      }

      if (existing) {
        existing.slot = slot;
        existing.customTime = customTimeVal;
        existing.subject = subject;
        existing.teacher = teacher;
        existing.room = room;
        existing.type = type;
        existing.isOnline = isOnline;
        existing.notes = notes;
      } else {
        lessons.push({
          id: getNextLessonId(),
          slot,
          customTime: customTimeVal,
          subject,
          teacher,
          room,
          type,
          isOnline,
          notes
        });
      }
    });

    // If targetDateKey had an override, clear it so the updated base template applies cleanly
    if (targetDateKey && dateOverrides[targetDateKey]) {
      delete dateOverrides[targetDateKey];
    }

    if (weeksToUpdate.length > 1) {
      showToast("Пара добавлена в базовое расписание на обе недели всего семестра! 💾");
    } else {
      showToast(`Пара сохранена в базовое расписание (${weeksToUpdate[0]}-я неделя на весь семестр) 💾`);
    }
  }

  closeModal("card-modal");
  saveAllChanges();
  renderAllViews();
}

function deleteCurrentLesson() {
  const idVal = document.getElementById("edit-lesson-id").value;
  if (!idVal) {
    closeModal("card-modal");
    return;
  }
  deleteLesson(idVal);
  closeModal("card-modal");
}

function deleteLesson(id) {
  if (!confirm("Удалить это занятие из шаблона?")) return;
  lessons = lessons.filter(l => String(l.id) !== String(id));
  saveAllChanges();
  renderAllViews();
  showToast("Занятие удалено из шаблона 🗑️");
}

function getNextLessonId() {
  if (lessons.length === 0) return 0;
  const numericIds = lessons.map(l => typeof l.id === 'number' ? l.id : -1);
  return Math.max(...numericIds, 0) + 1;
}

function openCloudModal() {
  const input = document.getElementById("cloud-db-url");
  if (input) input.value = cloudDatabaseUrl;
  openModal('cloud-modal');
}

// --- MODAL UTILS ---
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
}

// --- TOAST NOTIFICATIONS ---
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// --- STRING / HTML ESCAPING ---
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
