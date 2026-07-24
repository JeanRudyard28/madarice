const WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  "https://soulk.app.n8n.cloud/webhook/felana-chat"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"

/**
 * Envoie un message à l'agent Riziculture Solutions via le webhook n8n.
 * @param {string} chatInput - le message de l'utilisateur
 * @param {string} sessionId - identifiant de session (mémoire de conversation côté n8n)
 * @returns {Promise<{ output: string, sessionId: string }>}
 */
export async function sendChatMessage(chatInput, sessionId) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatInput, sessionId }),
  })

  if (!response.ok) {
    throw new Error(`Erreur serveur (${response.status})`)
  }

  const data = await response.json()

  return {
    output: data.output ?? "Désolé, je n'ai pas pu générer de réponse.",
    sessionId: data.sessionId || sessionId,
  }
}

// ---------- API Backend Integration ----------

/**
 * S'inscrire sur le backend
 * @param {string} email
 * @param {string} password
 */
export async function signupBackend(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur d'inscription (${response.status})`)
  }

  return response.json()
}

/**
 * Se connecter sur le backend
 * @param {string} email
 * @param {string} password
 */
export async function loginBackend(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur de connexion (${response.status})`)
  }

  return response.json()
}

/**
 * Récupérer toutes les conversations du backend
 * @param {string} token
 */
export async function getBackendConversations(token) {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur lors de la récupération des conversations (${response.status})`)
  }

  const data = await response.json()
  return data.map(mapBackendConversation)
}

/**
 * Créer une conversation sur le backend
 * @param {string} title
 * @param {string} userId
 * @param {string} token
 */
export async function createBackendConversation(title, userId, token) {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_id: userId, titre: title }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur lors de la création de la conversation (${response.status})`)
  }

  const data = await response.json()
  return mapBackendConversation(data)
}

/**
 * Modifier le titre d'une conversation sur le backend
 * @param {string} id
 * @param {string} title
 * @param {string} token
 */
export async function updateBackendConversation(id, title, token) {
  const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titre: title }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur lors de la mise à jour de la conversation (${response.status})`)
  }

  const data = await response.json()
  return mapBackendConversation(data)
}

/**
 * Supprimer une conversation sur le backend
 * @param {string} id
 * @param {string} token
 */
export async function deleteBackendConversation(id, token) {
  const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur lors de la suppression de la conversation (${response.status})`)
  }

  return response.json()
}

/**
 * Récupérer tous les messages d'une conversation
 * @param {string} conversationId
 * @param {string} token
 */
export async function getBackendMessages(conversationId, token) {
  const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur lors de la récupération des messages (${response.status})`)
  }

  const data = await response.json()
  return data.map(mapBackendMessage)
}

/**
 * Créer un message sur le backend
 * @param {string} conversationId
 * @param {string} content
 * @param {'user' | 'assistant'} role
 * @param {string} token
 */
export async function createBackendMessage(conversationId, content, role, token) {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      contenu: content,
      role: role
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur lors de l'enregistrement du message (${response.status})`)
  }

  const data = await response.json()
  return mapBackendMessage(data)
}

// Helpers de mapping
function mapBackendConversation(c) {
  return {
    id: c.id,
    title: c.titre,
    date: new Date(c.created_at || c.updated_at || Date.now()).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    messages: []
  }
}

function mapBackendMessage(m) {
  return {
    id: m.id,
    role: m.role,
    content: m.contenu
  }
}
