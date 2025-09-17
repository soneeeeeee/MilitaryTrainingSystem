// sessionHistory.js
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
    studentCount: "Количество учащихся",
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
    scenario1: "Режим обучения - ознакомление",
    scenario2: "Режим продвинутого обучения",
    scenario3: "Контрольные стрельбы",
    scenario4: "Мультипользовательский режим",
    scenario5: "Мультипользовательский режим - оборона",
    scenario6: "Режим обучения - гранатомет",
    scenario7: "Режим оператора дрона",
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
    userIdExists: "Пользователь с таким ID уже существует"
  },
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
    studentCount: "Оқушылар саны",
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
    scenario1: "Оқу режимі - танысу",
    scenario2: "Жетілдірілген оқу режимі",
    scenario3: "Бақылау атуы",
    scenario4: "Көп ойыншы режимі",
    scenario5: "Көп ойыншы режимі - қорғаныс",
    scenario6: "Оқу режимі - гранатомет",
    scenario7: "Дрон операторының режимі",
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
const validLanguages = ["ru", "kz"];

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
  return lang === "ru" ? "ru-RU" : "kk-KZ";
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
  if (pathname.includes("SessionHistory.html")) {
    const filterTypeEl = document.getElementById("filterType");
    const filterDateEl = document.getElementById("filterDate");
    let filters = {};
    if (filterTypeEl && filterDateEl) {
      filters.type = filterTypeEl.value || "all";
      filters.date = filterDateEl.value || "";
    }
    loadSessions(user, lang, "sessionsList", filters);
  }
}

// Logs out the user and redirects to the login page
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Creates a DOM element for a session with clickable navigation
function buildSessionElement(docId, data, userRole, lang, isHistoryPage) {
  const dateStr = formatDateField(data.time, lang);
  const timeStr = formatTimeField(data.time, lang);
  const scenarioType = data.scenarioType || data.type || data.scenario || "—";
  const result = Number.isFinite(data.result) ? data.result.toFixed(1) : (data.result ?? "—");
  const status = data.status || translations[lang].passed;

  const wrapper = document.createElement("div");
  wrapper.className = isHistoryPage ? "session-row" : "session-item";
  if (userRole === "teacher" && isHistoryPage) {
    wrapper.classList.add("teacher-view");
  }
  wrapper.dataset.sessionId = docId;

  if (isHistoryPage) {
    if (userRole === "teacher") {
      // For teachers: show student count instead of result, hide status
      wrapper.innerHTML = `
        <span>${dateStr}</span>
        <span>${timeStr}</span>
        <span>${scenarioType}</span>
        <span>${Array.isArray(data.user_ids) ? data.user_ids.length : (data.participants || 0)}</span>
      `;
    } else {
      // For students: show result and status
      wrapper.innerHTML = `
        <span>${dateStr}</span>
        <span>${timeStr}</span>
        <span>${scenarioType}</span>
        <span>${result}</span>
        <span class="status ${status.toLowerCase() === translations[lang].passed.toLowerCase() ? 'passed' : 'failed'}">${status}</span>
      `;
    }
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
      // Update table header based on user role
      const tableHeader = document.createElement("div");
      tableHeader.id = "tableHeader";
      
      if (user.role === "teacher") {
        tableHeader.className = "table-header teacher-view";
        tableHeader.innerHTML = `
          <span data-i18n="date">${translations[lang].date}</span>
          <span data-i18n="time">${translations[lang].time}</span>
          <span data-i18n="sessionType">${translations[lang].sessionType}</span>
          <span data-i18n="studentCount">${translations[lang].studentCount}</span>
        `;
      } else {
        tableHeader.className = "table-header";
        tableHeader.innerHTML = `
          <span data-i18n="date">${translations[lang].date}</span>
          <span data-i18n="time">${translations[lang].time}</span>
          <span data-i18n="sessionType">${translations[lang].sessionType}</span>
          <span data-i18n="result">${translations[lang].result}</span>
          <span data-i18n="status">${translations[lang].status}</span>
        `;
      }
      
      container.appendChild(tableHeader);
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

// Initializes the page, sets up event listeners, and loads user-specific content
document.addEventListener("DOMContentLoaded", async () => {
  const lang = validLanguages.includes(localStorage.getItem("lang")) ? localStorage.getItem("lang") : "ru";
  setLanguage(lang);

  const langSelect = document.querySelector(".language-selector");
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener("change", (e) => setLanguage(e.target.value));
  }

  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  const storedUserRaw = localStorage.getItem("loggedInUser");
  if (!storedUserRaw) {
    window.location.href = "index.html";
    return;
  }

  let user;
  try {
    user = JSON.parse(storedUserRaw);
    if (!user.user_id || !["teacher", "student"].includes(user.role)) {
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

  await loadSessions(user, lang, "sessionsList");

  window.isFilterApplied = false;
  const filterBtn = document.getElementById("filterBtn");
  if (filterBtn) {
    filterBtn.textContent = translations[lang].filter;
    filterBtn.addEventListener("click", async () => {
      const currentLang = localStorage.getItem("lang") || "ru";
      const type = document.getElementById("filterType")?.value || "all";
      const date = document.getElementById("filterDate")?.value || "";

      if (window.isFilterApplied) {
        document.getElementById("filterType").value = "all";
        document.getElementById("filterDate").value = "";
        filterBtn.textContent = translations[currentLang].filter;
        window.isFilterApplied = false;
        await loadSessions(user, currentLang, "sessionsList");
      } else if (type !== "all" || date) {
        filterBtn.textContent = translations[currentLang].resetFilter;
        window.isFilterApplied = true;
        await loadSessions(user, currentLang, "sessionsList", { type, date });
      }
    });
  }
});

export { translations };