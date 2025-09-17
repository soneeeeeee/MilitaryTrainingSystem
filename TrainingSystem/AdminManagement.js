// AdminManagement.js
// Import Firebase functions from the main script
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js"
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js"

import { translations } from "./script.js";

// Firebase configuration (same as main script)
const firebaseConfig = {
  apiKey: "AIzaSyD8Fsz6huGK5OmyDZYHl5nSORqRXyDv-wQ",
  authDomain: "mrlab-7895.firebaseapp.com",
  projectId: "mrlab-7895",
  storageBucket: "mrlab-7895.firebasestorage.app",
  messagingSenderId: "414848685586",
  appId: "1:414848685586:web:0254437986f2922b08eacb",
  measurementId: "G-BDEBMRD1VV",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const USER_COLLECTION = "users"
let currentEditingUserId = null
let allUsers = []

// Generate random credentials
function generateCredentials() {
  const lang = localStorage.getItem("lang") || "ru"

  // Generate random user ID
  const randomId = "user" + Math.floor(Math.random() * 9000 + 1000)
  document.getElementById("newUserId").value = randomId

  // Generate random password
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let password = ""
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  document.getElementById("newUserPassword").value = password
}

// Check if user ID already exists
async function checkUserIdExists(userId) {
  try {
    const q = query(collection(db, USER_COLLECTION), where("user_id", "==", userId))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error("Error checking user ID:", error)
    return false
  }
}

// Add new user
async function addUser(userData) {
  const lang = localStorage.getItem("lang") || "ru"

  try {
    // Check if user ID already exists
    const exists = await checkUserIdExists(userData.user_id)
    if (exists) {
      alert(translations[lang].userIdExists)
      return false
    }

    await addDoc(collection(db, USER_COLLECTION), userData)
    alert(translations[lang].userAdded)
    return true
  } catch (error) {
    console.error("Error adding user:", error)
    alert(translations[lang].errorAddingUser)
    return false
  }
}

// Load all users
async function loadUsers() {
  const lang = localStorage.getItem("lang") || "ru"

  try {
    const q = query(collection(db, USER_COLLECTION), orderBy("name"))
    const snapshot = await getDocs(q)

    allUsers = []
    snapshot.forEach((doc) => {
      allUsers.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    displayUsers(allUsers)
  } catch (error) {
    console.error("Error loading users:", error)
    const container = document.getElementById("usersListContainer")
    if (container) {
      container.innerHTML = `<p>${translations[lang].errorLoadingUsers}</p>`
    }
  }
}

// Display users in table
function displayUsers(users) {
  const lang = localStorage.getItem("lang") || "ru"
  const container = document.getElementById("usersListContainer")

  if (!container) return

  container.innerHTML = ""

  users.forEach((user) => {
    const userRow = document.createElement("div")
    userRow.className = "user-row"

    // Determine role class and text
    let roleClass, roleText;
    if (user.role === "student") {
      roleClass = "role-student";
      roleText = translations[lang].student;
    } else if (user.role === "teacher") {
      roleClass = "role-teacher";
      roleText = translations[lang].instructor;
    } else if (user.role === "admin") {
      roleClass = "role-admin";
      roleText = translations[lang].administrator;
    } else {
      roleClass = "";
      roleText = user.role || "—";
    }

    userRow.innerHTML = `
      <span>${user.name || "—"}</span>
      <span><span class="role-badge ${roleClass}">${roleText}</span></span>
      <span>${user.rank || "—"}</span>
      <span>${user.group || "—"}</span>
      <span>${user.user_id || "—"}</span>
      <div class="user-actions">
        <button class="btn btn-small btn-edit" onclick="editUser('${user.id}')" data-i18n="edit">${translations[lang].edit}</button>
        <button class="btn btn-small btn-delete" onclick="deleteUser('${user.id}')" data-i18n="deleteUser">${translations[lang].deleteUser}</button>
      </div>
    `

    container.appendChild(userRow)
  })
}

// Filter users
function filterUsers() {
  const roleFilter = document.getElementById("roleFilter").value
  const groupFilter = document.getElementById("groupFilter").value

  let filteredUsers = allUsers

  if (roleFilter !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role === roleFilter)
  }

  if (groupFilter !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.group === groupFilter)
  }

  displayUsers(filteredUsers)
}

// Toggle group field based on role
function toggleGroupField(roleSelect, groupSelect) {
  const groupField = groupSelect.closest('.form-group')
  if (roleSelect.value === 'teacher' || roleSelect.value === 'admin') {
    groupSelect.required = false
    groupSelect.value = ''
    if (groupField) groupField.style.display = 'none'
  } else {
    groupSelect.required = true
    if (groupField) groupField.style.display = ''
  }
}

// Edit user
function editUser(userId) {
  const user = allUsers.find((u) => u.id === userId)
  if (!user) return

  currentEditingUserId = userId

  // Populate edit form
  document.getElementById("editUserName").value = user.name || ""
  document.getElementById("editUserRole").value = user.role || "student"
  document.getElementById("editUserRank").value = user.rank || ""
  document.getElementById("editUserGroup").value = user.group || ""
  document.getElementById("editUserPassword").value = ""

  // Toggle group field
  const editUserRole = document.getElementById('editUserRole')
  const editUserGroup = document.getElementById('editUserGroup')
  toggleGroupField(editUserRole, editUserGroup)

  // Show modal
  document.getElementById("editUserModal").style.display = "flex"
}

// Close edit modal
function closeEditModal() {
  document.getElementById("editUserModal").style.display = "none"
  currentEditingUserId = null
}

// Update user
async function updateUser(userId, userData) {
  const lang = localStorage.getItem("lang") || "ru"

  try {
    const userRef = doc(db, USER_COLLECTION, userId)
    await updateDoc(userRef, userData)
    alert(translations[lang].userUpdated)
    return true
  } catch (error) {
    console.error("Error updating user:", error)
    alert(translations[lang].errorUpdatingUser)
    return false
  }
}

// Delete user
async function deleteUser(userId) {
  const lang = localStorage.getItem("lang") || "ru"

  if (!confirm(translations[lang].confirmDelete)) {
    return
  }

  try {
    await deleteDoc(doc(db, USER_COLLECTION, userId))
    alert(translations[lang].userDeleted)
    loadUsers() // Reload users list
  } catch (error) {
    console.error("Error deleting user:", error)
    alert(translations[lang].errorDeletingUser)
  }
}

// Make functions globally available
window.generateCredentials = generateCredentials
window.editUser = editUser
window.closeEditModal = closeEditModal
window.deleteUser = deleteUser

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  const lang = localStorage.getItem("lang") || "ru"

  // Check if user is logged in and is an admin
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
  if (!user.user_id || user.role !== "admin") {
    // Hide admin content and show access denied message
    const adminContent = document.getElementById("adminContent")
    const accessDenied = document.getElementById("accessDenied")
    
    if (adminContent) adminContent.style.display = "none"
    if (accessDenied) accessDenied.style.display = "block"
    
    return
  }

  // Load users
  await loadUsers()

  // Add user form handler
  const addUserForm = document.getElementById("addUserForm")
  if (addUserForm) {
    addUserForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const userData = {
        name: document.getElementById("userName").value.trim(),
        role: document.getElementById("userRole").value,
        rank: document.getElementById("userRank").value.trim(),
        group: document.getElementById("userGroup").value,
        user_id: document.getElementById("newUserId").value.trim(),
        password: document.getElementById("newUserPassword").value.trim(),
      }

      if (await addUser(userData)) {
        addUserForm.reset()
        loadUsers() // Reload users list
      }
    })
  }

  // Edit user form handler
  const editUserForm = document.getElementById("editUserForm")
  if (editUserForm) {
    editUserForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (!currentEditingUserId) return

      const userData = {
        name: document.getElementById("editUserName").value.trim(),
        role: document.getElementById("editUserRole").value,
        rank: document.getElementById("editUserRank").value.trim(),
        group: document.getElementById("editUserGroup").value,
      }

      // Only update password if provided
      const newPassword = document.getElementById("editUserPassword").value.trim()
      if (newPassword) {
        userData.password = newPassword
      }

      if (await updateUser(currentEditingUserId, userData)) {
        closeEditModal()
        loadUsers() // Reload users list
      }
    })
  }

  // Filter button handler
  const filterBtn = document.getElementById("filterUsersBtn")
  if (filterBtn) {
    filterBtn.addEventListener("click", filterUsers)
  }

  // Close modal when clicking outside
  const modal = document.getElementById("editUserModal")
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeEditModal()
      }
    })
  }

  // Setup group toggle for add form
  const userRole = document.getElementById('userRole')
  const userGroup = document.getElementById('userGroup')
  if (userRole && userGroup) {
    toggleGroupField(userRole, userGroup)
    userRole.addEventListener('change', () => toggleGroupField(userRole, userGroup))
  }

  // Setup group toggle for edit form
  const editUserRole = document.getElementById('editUserRole')
  const editUserGroup = document.getElementById('editUserGroup')
  if (editUserRole && editUserGroup) {
    editUserRole.addEventListener('change', () => toggleGroupField(editUserRole, editUserGroup))
  }
})