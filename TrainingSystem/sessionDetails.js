// sessionDetails.js - Handles both teacher and student views
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Fsz6huGK5OmyDZYHl5nSORqRXyDv-wQ",
  authDomain: "mrlab-7895.firebaseapp.com",
  projectId: "mrlab-7895",
  storageBucket: "mrlab-7895.firebasestorage.app",
  messagingSenderId: "414848685586",
  appId: "1:414848685586:web:0254437986f2922b08eacb",
  measurementId: "G-BDEBMRD1VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Constants
const SESSION_COLLECTION = "session";
const USER_COLLECTION = "users";

// Translation object
const translations = {
  ru: {
    sessionDetails: "Детали сессии",
    date: "Дата",
    time: "Время",
    cadetInfo: "Информация о курсанте",
    studentsInfo: "Информация о курсантах",
    student: "Курсант",
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
    nameLabel: "ФИО:",
    rankLabel: "Звание:",
    idLabel: "ID:",
    groupLabel: "Группа:",
    loading: "Загрузка...",
    noData: "Нет данных",
    close: "Закрыть",
    viewDetails: "Просмотреть детали",
    score: "Оценка",
    status: "Статус",
    result: "Результат",
    normative: "Норматив"
  },
  kz: {
    sessionDetails: "Сессия мәліметтері",
    date: "Күні",
    time: "Уақыт",
    cadetInfo: "Курсант туралы ақпарат",
    studentsInfo: "Курсанттар туралы ақпарат",
    student: "Курсант",
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
    nameLabel: "ТАӘ:",
    rankLabel: "Атағы:",
    idLabel: "ID:",
    groupLabel: "Топ:",
    loading: "Жүктелуде...",
    noData: "Деректер жоқ",
    close: "Жабу",
    viewDetails: "Толығырақ қарау",
    score: "Баға",
    status: "Күй",
    result: "Нәтиже",
    normative: "Норматив"
  }
};

// Get current language
function getCurrentLang() {
  return localStorage.getItem("lang") || "ru";
}

// Format date
function formatDate(dateValue) {
  if (!dateValue) return "—";
  const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
  return date.toLocaleDateString(getCurrentLang() === "ru" ? "ru-RU" : "kk-KZ");
}

// Format time
function formatTime(dateValue) {
  if (!dateValue) return "—";
  const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
  return date.toLocaleTimeString(getCurrentLang() === "ru" ? "ru-RU" : "kk-KZ", {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Logout function
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Download functions (placeholders)
function downloadVideo(studentId = null) {
  const lang = getCurrentLang();
  alert(studentId 
    ? `${translations[lang].downloadVideo} (${translations[lang].student} ID: ${studentId})`
    : translations[lang].downloadVideo);
}

function downloadPDF(studentId = null) {
  const lang = getCurrentLang();
  alert(studentId 
    ? `${translations[lang].downloadPDF} (${translations[lang].student} ID: ${studentId})`
    : translations[lang].downloadPDF);
}

function downloadExcel(studentId = null) {
  const lang = getCurrentLang();
  alert(studentId 
    ? `${translations[lang].downloadExcel} (${translations[lang].student} ID: ${studentId})`
    : translations[lang].downloadExcel);
}

function downloadWord(studentId = null) {
  const lang = getCurrentLang();
  alert(studentId 
    ? `${translations[lang].downloadWord} (${translations[lang].student} ID: ${studentId})`
    : translations[lang].downloadWord);
}

// Create student detail modal (for teachers)
function createStudentModal(student, sessionData, lang) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${translations[lang].student}: ${student.name || student.user_id}</h3>
        <span class="close">&times;</span>
      </div>
      <div class="modal-body">
        <div class="student-info">
          <div class="info-item">
            <label>${translations[lang].nameLabel}</label>
            <span>${student.name || "—"}</span>
          </div>
          <div class="info-item">
            <label>${translations[lang].rankLabel}</label>
            <span>${student.rank || "—"}</span>
          </div>
          <div class="info-item">
            <label>${translations[lang].idLabel}</label>
            <span>${student.user_id || "—"}</span>
          </div>
          <div class="info-item">
            <label>${translations[lang].groupLabel}</label>
            <span>${student.group || "—"}</span>
          </div>
        </div>
        
        <h4>${translations[lang].results}</h4>
        <div class="results-table">
          <div class="table-header">
            <span>${translations[lang].normative}</span>
            <span>${translations[lang].result}</span>
            <span>${translations[lang].score}</span>
            <span>${translations[lang].status}</span>
          </div>
          <div class="result-row">
            <span>${translations[lang].accuracy}</span>
            <span>${sessionData.accuracy ? `${sessionData.accuracy}%` : "—"}</span>
            <span>${sessionData.accuracyScore || "—"}</span>
            <span class="status ${sessionData.accuracyStatus === 'passed' ? 'passed' : 'failed'}">
              ${sessionData.accuracyStatus ? translations[lang][sessionData.accuracyStatus] : "—"}
            </span>
          </div>
          <div class="result-row">
            <span>${translations[lang].speed}</span>
            <span>${sessionData.speed ? `${sessionData.speed} сек` : "—"}</span>
            <span>${sessionData.speedScore || "—"}</span>
            <span class="status ${sessionData.speedStatus === 'passed' ? 'passed' : 'failed'}">
              ${sessionData.speedStatus ? translations[lang][sessionData.speedStatus] : "—"}
            </span>
          </div>
          <div class="result-row">
            <span>${translations[lang].safety}</span>
            <span>${sessionData.safety ? `${sessionData.safety}%` : "—"}</span>
            <span>${sessionData.safetyScore || "—"}</span>
            <span class="status ${sessionData.safetyStatus === 'passed' ? 'passed' : 'failed'}">
              ${sessionData.safetyStatus ? translations[lang][sessionData.safetyStatus] : "—"}
            </span>
          </div>
        </div>
        
        <div class="download-section">
          <h4>${translations[lang].downloadMaterials}</h4>
          <div class="download-buttons">
            <button class="btn btn-primary" onclick="downloadVideo('${student.user_id}')">
              ${translations[lang].downloadVideo}
            </button>
            <button class="btn btn-secondary" onclick="downloadPDF('${student.user_id}')">
              ${translations[lang].downloadPDF}
            </button>
            <button class="btn btn-secondary" onclick="downloadExcel('${student.user_id}')">
              ${translations[lang].downloadExcel}
            </button>
            <button class="btn btn-secondary" onclick="downloadWord('${student.user_id}')">
              ${translations[lang].downloadWord}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Close modal functionality
  modal.querySelector('.close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  return modal;
}

// Create student card element (for teachers)
function createStudentCard(student, sessionData, lang) {
  const card = document.createElement('div');
  card.className = 'student-card';
  card.innerHTML = `
    <div class="student-main-info">
      <div class="student-details">
        <h4>${student.name || student.user_id}</h4>
        <p>${student.rank || "—"} | ${student.group || "—"}</p>
        <div class="student-result">
          <span class="result-score">${sessionData.result || "—"}</span>
          <span class="status ${sessionData.status === 'passed' ? 'passed' : 'failed'}">
            ${sessionData.status ? translations[lang][sessionData.status] : "—"}
          </span>
        </div>
      </div>
    </div>
    <button class="view-details-btn">${translations[lang].viewDetails}</button>
  `;
  
  // Add click event to show modal with details
  card.querySelector('.view-details-btn').addEventListener('click', () => {
    const modal = createStudentModal(student, sessionData, lang);
    document.body.appendChild(modal);
  });
  
  return card;
}

// Update UI for student view
function setupStudentView(user, sessionData, lang) {
  // Update cadet info section
  const cadetInfo = document.querySelector('.cadet-info');
  if (cadetInfo) {
    const infoGrid = cadetInfo.querySelector('.info-grid');
    if (infoGrid) {
      infoGrid.innerHTML = `
        <div class="info-item">
          <label>${translations[lang].nameLabel}</label>
          <span>${user.name || "—"}</span>
        </div>
        <div class="info-item">
          <label>${translations[lang].rankLabel}</label>
          <span>${user.rank || "—"}</span>
        </div>
        <div class="info-item">
          <label>${translations[lang].idLabel}</label>
          <span>${user.user_id || "—"}</span>
        </div>
        <div class="info-item">
          <label>${translations[lang].groupLabel}</label>
          <span>${user.group || "—"}</span>
        </div>
      `;
    }
  }
  
  // Update results table
  const resultsTable = document.querySelector('.results-table');
  if (resultsTable) {
    resultsTable.innerHTML = `
      <div class="table-header">
        <span>${translations[lang].normative}</span>
        <span>${translations[lang].result}</span>
        <span>${translations[lang].score}</span>
        <span>${translations[lang].status}</span>
      </div>
      <div class="result-row">
        <span>${translations[lang].accuracy}</span>
        <span>${sessionData.accuracy ? `${sessionData.accuracy}%` : "—"}</span>
        <span>${sessionData.accuracyScore || "—"}</span>
        <span class="status ${sessionData.accuracyStatus === 'passed' ? 'passed' : 'failed'}">
          ${sessionData.accuracyStatus ? translations[lang][sessionData.accuracyStatus] : "—"}
        </span>
      </div>
      <div class="result-row">
        <span>${translations[lang].speed}</span>
        <span>${sessionData.speed ? `${sessionData.speed} сек` : "—"}</span>
        <span>${sessionData.speedScore || "—"}</span>
        <span class="status ${sessionData.speedStatus === 'passed' ? 'passed' : 'failed'}">
          ${sessionData.speedStatus ? translations[lang][sessionData.speedStatus] : "—"}
        </span>
      </div>
      <div class="result-row">
        <span>${translations[lang].safety}</span>
        <span>${sessionData.safety ? `${sessionData.safety}%` : "—"}</span>
        <span>${sessionData.safetyScore || "—"}</span>
        <span class="status ${sessionData.safetyStatus === 'passed' ? 'passed' : 'failed'}">
          ${sessionData.safetyStatus ? translations[lang][sessionData.safetyStatus] : "—"}
        </span>
      </div>
    `;
  }
  
  // Update download buttons text
  const downloadButtons = document.querySelectorAll('.download-buttons button');
  if (downloadButtons.length >= 4) {
    downloadButtons[0].textContent = translations[lang].downloadVideo;
    downloadButtons[1].textContent = translations[lang].downloadPDF;
    downloadButtons[2].textContent = translations[lang].downloadExcel;
    downloadButtons[3].textContent = translations[lang].downloadWord;
  }
}

// Update UI for teacher view
function setupTeacherView(students, sessionData, lang) {
  // Change cadet info title to plural
  const cadetInfoTitle = document.querySelector('.cadet-info h3');
  if (cadetInfoTitle) {
    cadetInfoTitle.textContent = translations[lang].studentsInfo;
  }
  
  // Replace info grid with students grid
  const studentsContainer = document.querySelector('.cadet-info .info-grid');
  if (studentsContainer) {
    studentsContainer.innerHTML = '';
    studentsContainer.classList.add('students-grid');
    
    students.forEach(student => {
      const studentCard = createStudentCard(student, sessionData, lang);
      studentsContainer.appendChild(studentCard);
    });
  }
  
  // Update results section title to show student count
  const resultsContainer = document.querySelector('.results-section');
  if (resultsContainer) {
    const resultsTitle = resultsContainer.querySelector('h3');
    if (resultsTitle) {
      resultsTitle.textContent = `${translations[lang].results} (${students.length} ${translations[lang].student.toLowerCase()})`;
    }
    
    // Hide results table for teachers (individual results are in modals)
    const resultsTable = resultsContainer.querySelector('.results-table');
    if (resultsTable) {
      resultsTable.style.display = 'none';
    }
  }
  
  // Update download section
  const downloadContainer = document.querySelector('.download-section');
  if (downloadContainer) {
    const downloadTitle = downloadContainer.querySelector('h3');
    if (downloadTitle) {
      downloadTitle.textContent = translations[lang].downloadMaterials;
    }
    
    // Update download buttons to be for the whole session
    const downloadButtons = downloadContainer.querySelectorAll('.download-buttons button');
    if (downloadButtons.length >= 4) {
      downloadButtons[0].textContent = translations[lang].downloadVideo;
      downloadButtons[1].textContent = translations[lang].downloadPDF;
      downloadButtons[2].textContent = translations[lang].downloadExcel;
      downloadButtons[3].textContent = translations[lang].downloadWord;
      
      // Update download functions to not specify student ID for teachers
      downloadButtons[0].onclick = () => downloadVideo();
      downloadButtons[1].onclick = () => downloadPDF();
      downloadButtons[2].onclick = () => downloadExcel();
      downloadButtons[3].onclick = () => downloadWord();
    }
  }
}

// Load session details
async function loadSessionDetails() {
  const lang = getCurrentLang();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("id");
  
  if (!sessionId) {
    document.querySelector(".session-details").innerHTML = `<p>${translations[lang].noData}</p>`;
    return;
  }
  
  try {
    // Get session data
    const sessionDoc = await getDoc(doc(db, SESSION_COLLECTION, sessionId));
    if (!sessionDoc.exists()) {
      document.querySelector(".session-details").innerHTML = `<p>${translations[lang].noData}</p>`;
      return;
    }
    
    const sessionData = sessionDoc.data();
    
    // Update session header
    const sessionHeader = document.querySelector(".details-header h2");
    if (sessionHeader) {
      sessionHeader.textContent = `${translations[lang].sessionDetails} #${sessionId} - ${sessionData.scenarioType || sessionData.type || "—"}`;
    }
    
    // Update session meta
    const sessionMeta = document.querySelector(".session-meta");
    if (sessionMeta) {
      sessionMeta.innerHTML = `
        <span>${translations[lang].date}: ${formatDate(sessionData.time)}</span>
        <span>${translations[lang].time}: ${formatTime(sessionData.time)}</span>
      `;
    }
    
    // Handle different views based on user role
    if (user.role === "teacher") {
      // Teacher view - show all students
      const studentIds = sessionData.user_ids || [];
      
      if (studentIds.length === 0) {
        document.querySelector(".cadet-info .info-grid").innerHTML = `<p>${translations[lang].noData}</p>`;
        return;
      }
      
      // Get student details
      const studentsQuery = query(
        collection(db, USER_COLLECTION),
        where("user_id", "in", studentIds)
      );
      
      const studentsSnapshot = await getDocs(studentsQuery);
      const students = [];
      
      studentsSnapshot.forEach(doc => {
        students.push({ user_id: doc.id, ...doc.data() });
      });
      
      // Setup teacher view
      setupTeacherView(students, sessionData, lang);
      
    } else {
      // Student view - show only current student's data
      setupStudentView(user, sessionData, lang);
    }
    
  } catch (error) {
    console.error("Error loading session details:", error);
    document.querySelector(".session-details").innerHTML = `<p>${translations[lang].noData}</p>`;
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  const lang = getCurrentLang();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  
  // Check if user is logged in
  if (!user.user_id) {
    window.location.href = "index.html";
    return;
  }
  
  // Set up language selector
  const langSelect = document.querySelector(".language-selector");
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener("change", (e) => {
      localStorage.setItem("lang", e.target.value);
      location.reload();
    });
  }
  
  // Set up logout button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
  
  // Set username in header
  const headerUsername = document.querySelector(".username");
  if (headerUsername && user.name) {
    const parts = user.name.split(" ");
    headerUsername.textContent = parts.length >= 3
      ? `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`
      : user.name;
  }
  
  // Load session details
  loadSessionDetails();
});

// Make download functions available globally
window.downloadVideo = downloadVideo;
window.downloadPDF = downloadPDF;
window.downloadExcel = downloadExcel;
window.downloadWord = downloadWord;