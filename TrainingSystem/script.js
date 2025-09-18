// script.js (modified for other webpages; removed SessionHistory-specific code)
// Firebase imports for initializing app and Firestore operations
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD8Fsz6huGK5OmyDZYHl5nSORqRXyDv-wQ",
  authDomain: "mrlab-7895.firebaseapp.com",
  projectId: "mrlab-7895",
  storageBucket: "mrlab-7895.firebasestorage.app",
  messagingSenderId: "414848685586",
  appId: "1:414848685586:web:0254437986f2922b08eacb",
  measurementId: "G-BDEBMRD1VV"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Translation object for multilingual support
const translations = {
  ru: {
    personalCabinet: "Личный кабинет",
    mainMenu: "Главное меню",
    sessionHistory: "История сессий",
    aboutTrainer: "О тренировочном центре",
    documentation: "Документация",
    instructions: "Инструкции",
    scenarios: "О сценариях",
    personalInfo: "Личная информация",
    nameLabel: "ФИО:",
    rankLabel: "Звание:",
    idLabel: "ID:",
    groupLabel: "Группа:",
    recommendations: "Советы по улучшению",
    recentSessions: "Последние 5 сессий",
    fullHistory: "Полная история всех сессий",
    recentGroupSessions: "Последние 5 сессий группы",
    loading: "Загрузка...",
    noSessions: "Нет сессий",
    errorLoading: "Ошибка загрузки",
    date: "Дата",
    time: "Время",
    sessionType: "Тип сессии",
    result: "Результат",
    score: "Оценка",
    status: "Статус",
    normative: "Норматив",
    filter: "Фильтр",
    all: "Все типы",
    login: "Вход в систему",
    password: "Пароль:",
    enter: "Войти",
    loginError: "Неверный ID или пароль",
    logout: "Выйти",
    sessionDetails: "Детали сессии",
    cadetInfo: "Информация о курсантах",
    results: "Результаты нормативов",
    downloadMaterials: "Скачать материалы",
    downloadVideo: "Скачать видео сессии",
    downloadPDF: "Результаты (PDF)",
    downloadExcel: "Результаты (Excel)",
    downloadWord: "Результаты (Word)",
    accuracy: "Точность стрельбы",
    speed: "Скорость стрельбы",
    safety: "Безопасность",
    passed: "Зачет",
    failed: "Незачет",
    mainSections: "Основные разделы",
    aboutTrainerDesc: "Узнайте о системе военной подготовки: цели, возможности, принципы работы",
    scenariosDesc: "Ознакомьтесь с тренировочными сценариями и их особенностями для эффективной военной подготовки.",
    instructionsDesc: "Получите пошаговые инструкции по использованию тренажера для максимальной эффективности.",
    documentationDesc: "Изучите полную документацию системы, включая технические детали и руководства.",
    learnMore: "Узнать подробнее",
    systemTitle: "Система военной подготовки",
    userId: "ID пользователя",
    averageLabel: "Средний балл:",
    resetFilter: "Сбросить фильтр",
    AdminManagement: "Управление пользователями",
    addNewUser: "Добавить нового пользователя",
    userRole: "Роль",
    student: "Курсант",
    instructor: "Инструктор",
    addUser: "Добавить пользователя",
    generateCredentials: "Сгенерировать данные",
    usersList: "Список пользователей",
    allRoles: "Все роли",
    allGroups: "Все группы",
    actions: "Действия",
    editUser: "Редактировать пользователя",
    saveChanges: "Сохранить изменения",
    cancel: "Отмена",
    deleteUser: "Удалить",
    edit: "Изменить",
    userAdded: "Пользователь успешно добавлен",
    userUpdated: "Пользователь успешно обновлен",
    userDeleted: "Пользователь удален",
    confirmDelete: "Вы уверены, что хотите удалить этого пользователя?",
    errorAddingUser: "Ошибка при добавлении пользователя",
    errorUpdatingUser: "Ошибка при обновлении пользователя",
    errorDeletingUser: "Ошибка при удалении пользователя",
    errorLoadingUsers: "Ошибка при загрузке пользователей",
    userIdExists: "Пользователь с таким ID уже существует"},
  kz: {
    personalCabinet: "Жеке кабинет",
    mainMenu: "Негізгі мәзір",
    sessionHistory: "Сессия тарихы",
    aboutTrainer: "Жаттығу орталығы туралы",
    documentation: "Құжаттама",
    instructions: "Нұсқаулар",
    scenarios: "Сценарийлер туралы",
    personalInfo: "Жеке ақпарат",
    nameLabel: "ТАӘ:",
    rankLabel: "Атағы:",
    idLabel: "ID:",
    groupLabel: "Топ:",
    recommendations: "Жақсарту кеңестері",
    recentSessions: "Соңғы 5 сессия",
    fullHistory: "Барлық сессиялардың толық тарихы",
    recentGroupSessions: "Топтың соңғы 5 сессиясы",
    loading: "Жүктелуде...",
    noSessions: "Сессиялар жоқ",
    errorLoading: "Сессияларды жүктеу қатесі",
    date: "Күні",
    time: "Уақыт",
    sessionType: "Сессия түрі",
    result: "Нәтиже",
    score: "Баға",
    status: "Күй",
    normative: "Норматив",
    filter: "Сүзгі",
    all: "Барлық түрлер",
    login: "Жүйеге кіру",
    password: "Құпия сөз:",
    enter: "Кіру",
    loginError: "ID немесе құпия сөз дұрыс емес",
    logout: "Шығу",
    sessionDetails: "Сессия мәліметтері",
    cadetInfo: "Курсанттар туралы ақпарат",
    results: "Нормативтер нәтижелері",
    downloadMaterials: "Материалдарды жүктеу",
    downloadVideo: "Сессия видеосын жүктеу",
    downloadPDF: "Нәтижелер (PDF)",
    downloadExcel: "Нәтижелер (Excel)",
    downloadWord: "Нәтижелер (Word)",
    accuracy: "Ату дәлдігі",
    speed: "Ату жылдамдығы",
    safety: "Қауіпсіздік",
    passed: "Есептелді",
    failed: "Есептелмеді",
    mainSections: "Негізгі бөлімдер",
    aboutTrainerDesc: "Әскери дайындық жүйесі туралы біліңіз: мақсаттар, мүмкіндіктер, жұмыс принциптері",
    scenariosDesc: "Тиімді әскери дайындық үшін оқу сценарийлерімен және олардың ерекшеліктерімен танысыңыз.",
    instructionsDesc: "Тренажерді максималды тиімділікпен пайдалану үшін қадамдық нұсқауларды алыңыз.",
    documentationDesc: "Техникалық мәліметтер мен нұсқаулықтарды қамтитын жүйенің толық құжаттамасын зерттеңіз.",
    learnMore: "Толығырақ білу",
    systemTitle: "Әскери дайындық жүйесі",
    userId: "Пайдаланушы ID",
    averageLabel: "Орташа балл:",
    resetFilter: "Сүзгіні қалпына келтіру",
    AdminManagement: "Пайдаланушыларды басқару",
    addNewUser: "Жаңа пайдаланушы қосу",
    userRole: "Рөл",
    student: "Курсант",
    instructor: "Инструктор",
    addUser: "Пайдаланушы қосу",
    generateCredentials: "Деректерді генерациялау",
    usersList: "Пайдаланушылар тізімі",
    allRoles: "Барлық рөлдер",
    allGroups: "Барлық топтар",
    actions: "Әрекеттер",
    editUser: "Пайдаланушыны өңдеу",
    saveChanges: "Өзгерістерді сақтау",
    cancel: "Болдырмау",
    deleteUser: "Жою",
    edit: "Өңдеу",
    userAdded: "Пайдаланушы сәтті қосылды",
    userUpdated: "Пайдаланушы сәтті жаңартылды",
    userDeleted: "Пайдаланушы жойылды",
    confirmDelete: "Бұл пайдаланушыны жойғыңыз келетініне сенімдісіз бе?",
    errorAddingUser: "Пайдаланушыны қосу кезінде қате",
    errorUpdatingUser: "Пайдаланушыны жаңарту кезінде қате",
    errorDeletingUser: "Пайдаланушыны жою кезінде қате",
    errorLoadingUsers: "Пайдаланушыларды жүктеу кезінде қате",
    userIdExists: "Мұндай ID-мен пайдаланушы бұрыннан бар",
}
};

// Constants for Firestore collection names
const SESSION_COLLECTION = "session";
const USER_COLLECTION = "users";
const validLanguages = ["en", "ru", "kz"];

// Converts a value to a Date object, handling various input formats
function toDate(value) {
  if (!value) return null;
  if (value.toDate && typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "number") return value < 1e11 ? new Date(value * 1000) : new Date(value);
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d) ? null : d;
  }
  return null;
}

// Formats a date value into a localized date string (e.g., MM/DD/YYYY)
function formatDateField(value, lang) {
  const d = toDate(value);
  return d ? d.toLocaleDateString(getLocale(lang), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }) : "—";
}

// Formats a date value into a localized time string (e.g., 16:08)
function formatTimeField(value, lang) {
  const d = toDate(value);
  return d ? d.toLocaleTimeString(getLocale(lang), {
    hour: '2-digit',
    minute: '2-digit'
  }) : "—";
}

// Returns the locale string for a given language code
function getLocale(lang) {
  return lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "kk-KZ";
}

// Sets the interface language and updates translated elements
function setLanguage(lang) {
  if (!validLanguages.includes(lang)) lang = "ru";
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key] || key;
  });

  const filterBtn = document.getElementById("filterBtn");
  if (filterBtn) {
    filterBtn.textContent = window.isFilterApplied ? translations[lang].resetFilter : translations[lang].filter;
  }

  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const pathname = window.location.pathname;
  if (pathname.includes("SessionDetails.html")) {
    loadSessionDetails(user, lang);
  } else if (pathname.includes("profile.html") || pathname.includes("SessionHistory.html")) {
    let containerId = pathname.includes("profile.html")
      ? user.role === "student" ? "sessionsListCadet" : "sessionsListInstructor"
      : "sessionsList";
    let filters = {};
    if (pathname.includes("SessionHistory.html")) {
      const filterTypeEl = document.getElementById("filterType");
      const filterDateEl = document.getElementById("filterDate");
      if (filterTypeEl && filterDateEl) {
        filters.type = filterTypeEl.value || "all";
        filters.date = filterDateEl.value || "";
      }
    }
    loadSessions(user, lang, containerId, filters);
  }
}

// Logs out the user and redirects to the login page
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Placeholder functions for download features (not implemented)
window.downloadVideo = () => alert(translations[localStorage.getItem("lang") || "ru"].downloadVideo);
window.downloadPDF = () => alert(translations[localStorage.getItem("lang") || "ru"].downloadPDF);
window.downloadExcel = () => alert(translations[localStorage.getItem("lang") || "ru"].downloadExcel);
window.downloadWord = () => alert(translations[localStorage.getItem("lang") || "ru"].downloadWord);

// Creates a DOM element for a session with clickable navigation
function buildSessionElement(docId, data, userRole, lang, isHistoryPage) {
  const dateStr = formatDateField(data.time, lang);
  const timeStr = formatTimeField(data.time, lang);
  const scenarioType = data.scenarioType || data.type || data.scenario || "—";
  const result = Number.isFinite(data.result) ? data.result.toFixed(1) : (data.result ?? "—");
  const status = data.status || translations[lang].passed;

  const wrapper = document.createElement("div");
  wrapper.className = isHistoryPage ? "session-row" : "session-item";
  wrapper.dataset.sessionId = docId;

  if (isHistoryPage) {
    wrapper.innerHTML = `
      <span>${dateStr}</span>
      <span>${timeStr}</span>
      <span>${scenarioType}</span>
      <span>${userRole === "teacher" ? (Array.isArray(data.user_ids) ? data.user_ids.length : (data.participants || 0)) : result}</span>
      <span class="status ${status.toLowerCase() === translations[lang].passed.toLowerCase() ? 'passed' : 'failed'}">${status}</span>
    `;
  } else {
    wrapper.innerHTML = `
      <span class="session-date">${dateStr}</span>
      <span class="session-type">${scenarioType}</span>
      <span class="session-result">${userRole === "teacher" ? (Array.isArray(data.user_ids) ? data.user_ids.length : (data.participants || 0)) : result}</span>
    `;
  }

  wrapper.addEventListener("click", () => {
    window.location.href = `SessionDetails.html?id=${encodeURIComponent(docId)}`;
  });
  return wrapper;
}

// Loads session data from Firestore and displays it in the specified container
async function loadSessions(user, lang, containerId, filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container not found: ${containerId}`);
    return;
  }
  container.innerHTML = `<p>${translations[lang].loading}</p>`;

  const isHistoryPage = containerId === "sessionsList";
  try {
    let q = query(
      collection(db, SESSION_COLLECTION),
      user.role === "teacher" ? where("teacher_id", "==", user.user_id) : where("user_ids", "array-contains", user.user_id),
      orderBy("time", "desc")
    );

    if (isHistoryPage) {
      if (filters.type && filters.type !== "all") {
        q = query(q, where("scenarioType", "==", filters.type));
      }
      if (filters.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        q = query(q, where("time", ">=", start), where("time", "<", end));
      }
    } else {
      q = query(q, limit(5));
    }

    const snap = await getDocs(q);
    container.innerHTML = "";

    if (isHistoryPage) {
      container.innerHTML = `
        <div class="table-header">
          <span data-i18n="date">${translations[lang].date}</span>
          <span data-i18n="time">${translations[lang].time}</span>
          <span data-i18n="sessionType">${translations[lang].sessionType}</span>
          <span data-i18n="result">${translations[lang].result}</span>
          <span data-i18n="status">${translations[lang].status}</span>
        </div>`;
    }

    if (snap.empty) {
      container.innerHTML += `<p>${translations[lang].noSessions}</p>`;
    } else {
      snap.forEach(doc => {
        const el = buildSessionElement(doc.id, doc.data(), user.role, lang, isHistoryPage);
        container.appendChild(el);
      });
    }
  } catch (err) {
    console.error("Session load error:", err.message);
    container.innerHTML = `<p>${translations[lang].errorLoading}</p>`;
    if (err.code === "failed-precondition" && err.message.includes("index")) {
      console.log("Firestore requires a composite index. Create it in the Firestore console with the following details:");
      const baseFields = user.role === "teacher"
        ? `Collection: ${SESSION_COLLECTION}, Fields: teacher_id (==), time (desc)`
        : `Collection: ${SESSION_COLLECTION}, Fields: user_ids (array-contains), time (desc)`;
      console.log(baseFields);
      if (isHistoryPage && filters.type && filters.type !== "all") {
        console.log(`For type filter: Collection: ${SESSION_COLLECTION}, Fields: ${user.role === "teacher" ? "teacher_id (==)" : "user_ids (array-contains)"}, scenarioType (==), time (desc)`);
      }
      if (isHistoryPage && filters.date) {
        console.log(`For date filter: Collection: ${SESSION_COLLECTION}, Fields: ${user.role === "teacher" ? "teacher_id (==)" : "user_ids (array-contains)"}, time (>=), time (<), time (desc)`);
      }
    }
  }
}

// Computes the average score for a user's sessions
async function computeAverageScore(user, lang) {
  try {
    const q = query(
      collection(db, SESSION_COLLECTION),
      where("user_ids", "array-contains", user.user_id),
      orderBy("time", "desc")
    );
    const snap = await getDocs(q);
    let total = 0, count = 0;
    snap.forEach(doc => {
      const val = doc.data()?.result;
      if (Number.isFinite(val)) {
        total += val;
        count++;
      }
    });
    return count > 0 ? (total / count).toFixed(1) : translations[lang].noSessions;
  } catch (err) {
    console.warn("Failed to compute average:", err.message);
    return translations[lang].noSessions;
  }
}

// Handles user login by validating credentials against Firestore
// Handles user login by validating credentials against Firestore
async function handleLogin(userId, password, lang) {
  if (!userId || !password) {
    alert(translations[lang].loginError);
    return false;
  }
  try {
    const q = query(
      collection(db, USER_COLLECTION),
      where("user_id", "==", userId),
      where("password", "==", password)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      alert(translations[lang].loginError);
      return false;
    }
    const userData = snap.docs[0].data();
    const user = {
      user_id: userData.user_id,
      role: userData.role || "student",
      name: userData.name || "",
      rank: userData.rank || "",
      group: userData.group || ""
    };
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    if (user.role === "admin") {
      window.location.href = "administrator.html";
    } else {
      window.location.href = "MainMenu.html";
    }
    
    return true;
  } catch (err) {
    console.error("Login error:", err.message);
    alert(translations[lang].errorLoading);
    return false;
  }
}

// Loads and displays detailed session information
async function loadSessionDetails(user, lang) {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("id");
  if (!sessionId) {
    document.querySelector(".session-details").innerHTML = `<p>${translations[lang].errorLoading}</p>`;
    return;
  }

  try {
    const docRef = doc(db, SESSION_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      document.querySelector(".session-details").innerHTML = `<p>${translations[lang].noSessions}</p>`;
      return;
    }

    const data = docSnap.data();
    const dateStr = formatDateField(data.time, lang);
    const timeStr = formatTimeField(data.time, lang);
    const scenarioType = data.scenarioType || data.type || data.scenario || "—";

    const sessionHeader = document.querySelector(".details-header h2");
    if (sessionHeader) {
      sessionHeader.textContent = `${translations[lang].sessionDetails} #${sessionId} - ${scenarioType}`;
    }

    const sessionMeta = document.querySelector(".session-meta");
    if (sessionMeta) {
      sessionMeta.innerHTML = `
        <span data-i18n="date">${translations[lang].date}: ${dateStr}</span>
        <span data-i18n="time">${translations[lang].time}: ${timeStr}</span>
      `;
    }

    const cadetInfo = document.querySelector(".cadet-info");
    if (cadetInfo) {
      const infoGrid = cadetInfo.querySelector(".info-grid");
      infoGrid.innerHTML = `
        <div class="info-item">
          <label data-i18n="nameLabel">${translations[lang].nameLabel}</label>
          <span>${user.name || "—"}</span>
        </div>
        <div class="info-item">
          <label data-i18n="rankLabel">${translations[lang].rankLabel}</label>
          <span>${user.rank || "—"}</span>
        </div>
        <div class="info-item">
          <label data-i18n="idLabel">${translations[lang].idLabel}</label>
          <span>${user.user_id || "—"}</span>
        </div>
        <div class="info-item">
          <label data-i18n="groupLabel">${translations[lang].groupLabel}</label>
          <span>${user.group || "—"}</span>
        </div>
      `;
    }

    const resultsTable = document.querySelector(".results-table");
    if (resultsTable) {
      resultsTable.innerHTML = `
        <div class="table-header">
          <span data-i18n="normative">${translations[lang].normative}</span>
          <span data-i18n="result">${translations[lang].result}</span>
          <span data-i18n="score">${translations[lang].score}</span>
          <span data-i18n="status">${translations[lang].status}</span>
        </div>
        <div class="result-row">
          <span data-i18n="accuracy">${translations[lang].accuracy}</span>
          <span>${data.accuracy ? `${data.accuracy}%` : "—"}</span>
          <span>${data.accuracyScore ? data.accuracyScore.toFixed(1) : "—"}</span>
          <span class="status ${data.accuracyStatus?.toLowerCase() === translations[lang].passed.toLowerCase() ? 'passed' : 'failed'}" data-i18n="${data.accuracyStatus?.toLowerCase() || 'passed'}">${data.accuracyStatus || translations[lang].passed}</span>
        </div>
        <div class="result-row">
          <span data-i18n="speed">${translations[lang].speed}</span>
          <span>${data.speed ? `${data.speed} sec` : "—"}</span>
          <span>${data.speedScore ? data.speedScore.toFixed(1) : "—"}</span>
          <span class="status ${data.speedStatus?.toLowerCase() === translations[lang].passed.toLowerCase() ? 'passed' : 'failed'}" data-i18n="${data.speedStatus?.toLowerCase() || 'passed'}">${data.speedStatus || translations[lang].passed}</span>
        </div>
        <div class="result-row">
          <span data-i18n="safety">${translations[lang].safety}</span>
          <span>${data.safety ? `${data.safety}%` : "—"}</span>
          <span>${data.safetyScore ? data.safetyScore.toFixed(1) : "—"}</span>
          <span class="status ${data.safetyStatus?.toLowerCase() === translations[lang].passed.toLowerCase() ? 'passed' : 'failed'}" data-i18n="${data.safetyStatus?.toLowerCase() || 'passed'}">${data.safetyStatus || translations[lang].passed}</span>
        </div>
      `;
    }

    const downloadSection = document.querySelector(".download-section h3");
    if (downloadSection) {
      downloadSection.setAttribute("data-i18n", "downloadMaterials");
      downloadSection.textContent = translations[lang].downloadMaterials;
    }

    const downloadButtons = document.querySelectorAll(".download-buttons button");
    downloadButtons.forEach(btn => {
      const text = btn.getAttribute("onclick").includes("downloadVideo") ? translations[lang].downloadVideo :
                   btn.getAttribute("onclick").includes("downloadPDF") ? translations[lang].downloadPDF :
                   btn.getAttribute("onclick").includes("downloadExcel") ? translations[lang].downloadExcel :
                   translations[lang].downloadWord;
      btn.textContent = text;
    });
  } catch (err) {
    console.error("Session details load error:", err.message);
    document.querySelector(".session-details").innerHTML = `<p>${translations[lang].errorLoading}</p>`;
  }
}

// Initializes the page, sets up event listeners, and loads user-specific content
document.addEventListener("DOMContentLoaded", async () => {
  const lang = validLanguages.includes(localStorage.getItem("lang")) ? localStorage.getItem("lang") : "ru";
  setLanguage(lang);

  const langSelect = document.querySelector(".language-selector");
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener("change", (e) => setLanguage(e.target.value));
  }

  const isLoginPage = window.location.pathname.includes("index.html") || window.location.pathname === "/";
  const isProfilePage = window.location.pathname.includes("profile.html");
  const isSessionDetailsPage = window.location.pathname.includes("SessionDetails.html");

  if (!isLoginPage) {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  }

  if (isLoginPage) {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userId = document.getElementById("userId")?.value?.trim();
        const password = document.getElementById("password")?.value?.trim();
        await handleLogin(userId, password, lang);
      });
    }
    return;
  }

  const storedUserRaw = localStorage.getItem("loggedInUser");
  if (!storedUserRaw) {
    window.location.href = "index.html";
    return;
  }

  let user;
  try {
    user = JSON.parse(storedUserRaw);
    if (!user.user_id || !["teacher", "student","admin"].includes(user.role)) {
      throw new Error("Invalid user data");
    }
  } catch (err) {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
    return;
  }

  const headerUsername = document.querySelector(".username");
  if (headerUsername && user.name) {
    const parts = user.name.split(" ");
    headerUsername.textContent = parts.length >= 3
      ? `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`
      : user.name;
  }

  if (isProfilePage) {
    const cadetProfile = document.getElementById("cadetProfile");
    const instructorProfile = document.getElementById("instructorProfile");

    if (user.role === "student") {
      if (cadetProfile) cadetProfile.style.display = "block";
      if (instructorProfile) instructorProfile.style.display = "none";

      const nameEl = document.getElementById("cadetName");
      const rankEl = document.getElementById("cadetRank");
      const ratingEl = document.getElementById("cadetRating");

      if (nameEl) nameEl.textContent = user.name || "—";
      if (rankEl) rankEl.textContent = user.rank || "—";
      if (ratingEl) {
        const avg = await computeAverageScore(user, lang);
        ratingEl.textContent = avg;
      }
    } else {
      if (cadetProfile) cadetProfile.style.display = "none";
      if (instructorProfile) instructorProfile.style.display = "block";

      const nameEl = document.getElementById("instrName");
      const rankEl = document.getElementById("instrRank");
      const groupEl = document.getElementById("instrGroup");

      if (nameEl) nameEl.textContent = user.name || "—";
      if (rankEl) rankEl.textContent = user.rank || "—";
      if (groupEl) groupEl.textContent = user.group || "—";
    }
  }

  if (isSessionDetailsPage) {
    await loadSessionDetails(user, lang);
  } else {
    const containerId = isProfilePage
      ? (user.role === "student" ? "sessionsListCadet" : "sessionsListInstructor")
      : "sessionsList";
    await loadSessions(user, lang, containerId);
  }

});

export { translations };