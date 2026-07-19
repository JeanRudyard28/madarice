// NOTE: le workflow n8n fourni n'expose qu'un webhook de chat ("felana-chat"),
// il n'y a pas encore de backend d'authentification ni de persistance des
// conversations côté serveur. En attendant un vrai backend (Supabase, API
// custom, etc.), l'inscription/connexion et l'historique sont gérés ici via
// localStorage, avec la même forme de données pour faciliter la migration
// future vers de vrais appels API.

const USER_KEY = "racine_user"
const USERS_KEY = "racine_users"
const CONVERSATIONS_KEY = "racine_conversations"

// ---------- Utilisateur ----------

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

function saveCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY)
}

export function registerUser({ name, email, password }) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Un compte existe déjà avec cet email.")
  }

  users.push({ name, email, password })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  const user = { name, email }
  saveCurrentUser(user)
  return user
}

export function loginUser({ email, password }) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (!found) {
    throw new Error("Email ou mot de passe incorrect.")
  }

  const user = { name: found.name, email: found.email }
  saveCurrentUser(user)
  return user
}

export function logoutUser() {
  clearCurrentUser()
}

// ---------- Historique des conversations ----------

function defaultGreeting() {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "Bonjour ! Je suis Felana, votre assistant rizicole. Comment puis-je vous aider ?",
  }
}

export function getConversations() {
  const raw = localStorage.getItem(CONVERSATIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveConversations(conversations) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
}

export function createConversation() {
  const conversations = getConversations()
  const newConv = {
    id: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    title: "Nouvelle conversation",
    date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    messages: [defaultGreeting()],
  }
  conversations.unshift(newConv)
  saveConversations(conversations)
  return newConv
}

export function getOrCreateInitialConversation() {
  const conversations = getConversations()
  if (conversations.length > 0) return conversations[0]
  return createConversation()
}

export function updateConversation(id, updates) {
  const conversations = getConversations()
  const index = conversations.findIndex((c) => c.id === id)
  if (index === -1) return null
  conversations[index] = { ...conversations[index], ...updates }
  saveConversations(conversations)
  return conversations[index]
}

export function deleteConversation(id) {
  const conversations = getConversations().filter((c) => c.id !== id)
  saveConversations(conversations)
  return conversations
}

// Génère un titre court à partir du premier message de l'utilisateur
export function titleFromMessage(text) {
  const trimmed = text.trim()
  if (trimmed.length <= 40) return trimmed
  return trimmed.slice(0, 40) + "…"
}
