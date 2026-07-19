const WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  "https://soulk.app.n8n.cloud/webhook/felana-chat"

/**
 * Envoie un message à l'agent Felana via le webhook n8n.
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
