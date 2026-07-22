import { useEffect, useState } from 'react'
import ChatInput from "../components/ChatInput"
import ChatWindow from "../components/ChatWindow"
import Sidebar from "../components/Sidebar"
import { useAuth } from '../context/AuthContext'
import {
  sendChatMessage,
  getBackendConversations,
  createBackendConversation,
  updateBackendConversation,
  deleteBackendConversation,
  getBackendMessages,
  createBackendMessage,
} from '../lib/api'
import {
  getConversations,
  getOrCreateInitialConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  titleFromMessage,
} from '../lib/storage'

const defaultGreeting = {
  id: 'default-greeting',
  role: 'assistant',
  content: "Bonjour ! Je suis Felana, votre assistant rizicole. Comment puis-je vous aider ?"
}

const ChatPage = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Charge l'historique au montage (ou changement d'utilisateur)
  useEffect(() => {
    const loadData = async () => {
      setErrorMsg('')
      if (user && user.token) {
        setLoading(true)
        try {
          const backendConvs = await getBackendConversations(user.token)
          if (backendConvs.length > 0) {
            // Charge les messages pour la première conversation
            const firstConv = backendConvs[0]
            const msgs = await getBackendMessages(firstConv.id, user.token)
            firstConv.messages = msgs
            setConversations(backendConvs)
            setActiveId(firstConv.id)
          } else {
            // Crée une conversation initiale si aucune n'existe sur le serveur
            const newConv = await createBackendConversation("Nouvelle conversation", user.id, user.token)
            newConv.messages = []
            setConversations([newConv])
            setActiveId(newConv.id)
          }
        } catch (err) {
          setErrorMsg("Impossible de charger les conversations depuis le serveur.")
        } finally {
          setLoading(false)
        }
      } else {
        // Flux invité
        const initial = getOrCreateInitialConversation()
        setConversations(getConversations())
        setActiveId(initial.id)
      }
    }
    loadData()
  }, [user])

  const activeConversation = conversations.find((c) => c.id === activeId) || null

  const handleNewConversation = async () => {
    setErrorMsg('')
    if (user && user.token) {
      setLoading(true)
      try {
        const newConv = await createBackendConversation("Nouvelle conversation", user.id, user.token)
        newConv.messages = []
        setConversations((prev) => [newConv, ...prev])
        setActiveId(newConv.id)
      } catch (err) {
        setErrorMsg("Impossible de créer une nouvelle conversation sur le serveur.")
      } finally {
        setLoading(false)
      }
    } else {
      const conv = createConversation()
      setConversations(getConversations())
      setActiveId(conv.id)
    }
  }

  const handleSelectConversation = async (id) => {
    setActiveId(id)
    setErrorMsg('')
    setSidebarOpen(false)

    // Charger les messages à la sélection si en mode connecté
    if (user && user.token) {
      setLoading(true)
      try {
        const msgs = await getBackendMessages(id, user.token)
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, messages: msgs } : c))
        )
      } catch (err) {
        setErrorMsg("Impossible de récupérer les messages de la conversation.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteConversation = async (id) => {
    setErrorMsg('')
    if (user && user.token) {
      setLoading(true)
      try {
        await deleteBackendConversation(id, user.token)
        const remaining = conversations.filter((c) => c.id !== id)
        if (remaining.length === 0) {
          const newConv = await createBackendConversation("Nouvelle conversation", user.id, user.token)
          newConv.messages = []
          setConversations([newConv])
          setActiveId(newConv.id)
        } else {
          setConversations(remaining)
          if (activeId === id) {
            const nextActive = remaining[0]
            const msgs = await getBackendMessages(nextActive.id, user.token)
            nextActive.messages = msgs
            setActiveId(nextActive.id)
          }
        }
      } catch (err) {
        setErrorMsg("Impossible de supprimer la conversation sur le serveur.")
      } finally {
        setLoading(false)
      }
    } else {
      const remaining = deleteConversation(id)
      if (remaining.length === 0) {
        const conv = createConversation()
        setConversations(getConversations())
        setActiveId(conv.id)
      } else {
        setConversations(remaining)
        if (activeId === id) setActiveId(remaining[0].id)
      }
    }
  }

  const handleSend = async (text) => {
    if (!activeConversation || !text.trim()) return
    setErrorMsg('')

    if (user && user.token) {
      const currentMessages = activeConversation.messages || []
      const isFirstUserMessage = !currentMessages.some((m) => m.role === 'user')

      setLoading(true)
      try {
        // 1. Sauvegarder le message de l'utilisateur dans le backend
        const userMsg = await createBackendMessage(activeConversation.id, text, 'user', user.token)
        const updatedMessages = [...currentMessages, userMsg]

        let updatedTitle = activeConversation.title
        if (isFirstUserMessage) {
          updatedTitle = titleFromMessage(text)
          // Mettre à jour le titre sur le backend
          await updateBackendConversation(activeConversation.id, updatedTitle, user.token)
        }

        // Mettre à jour l'UI locale immédiatement avec le message utilisateur
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? { ...c, title: updatedTitle, messages: updatedMessages }
              : c
          )
        )

        // 2. Envoyer le message à n8n (on passe l'id backend comme sessionId pour l'historique de n8n)
        const { output } = await sendChatMessage(text, activeConversation.id)

        // 3. Sauvegarder le message de l'assistant dans le backend
        const assistantMsg = await createBackendMessage(activeConversation.id, output, 'assistant', user.token)

        // Mettre à jour l'UI avec la réponse
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? { ...c, messages: [...updatedMessages, assistantMsg] }
              : c
          )
        )
      } catch (err) {
        setErrorMsg("Impossible d'enregistrer les messages ou d'obtenir une réponse de l'assistant.")
      } finally {
        setLoading(false)
      }
    } else {
      // Mode invité local
      const userMessage = { id: crypto.randomUUID(), role: 'user', content: text }
      const isFirstUserMessage = !activeConversation.messages.some((m) => m.role === 'user')

      const updatedMessages = [...activeConversation.messages, userMessage]
      const updated = updateConversation(activeConversation.id, {
        messages: updatedMessages,
        title: isFirstUserMessage ? titleFromMessage(text) : activeConversation.title,
      })
      setConversations(getConversations())
      setLoading(true)

      try {
        const { output } = await sendChatMessage(text, activeConversation.sessionId)
        const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', content: output }
        updateConversation(activeConversation.id, {
          messages: [...updated.messages, assistantMessage],
        })
        setConversations(getConversations())
      } catch (err) {
        setErrorMsg("Impossible de contacter Racine pour le moment. Vérifiez la connexion au workflow n8n.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Prepend le message de bienvenue par défaut s'il n'y a pas de messages
  const messagesToDisplay = activeConversation
    ? (activeConversation.messages && activeConversation.messages.length > 0
        ? activeConversation.messages
        : [defaultGreeting])
    : []

  return (
    <div className="chat-page">
      {/* Overlay mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="chat-area">
        {/* Mobile topbar */}
        <div className="chat-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
          <span className="chat-topbar-title">🌾 Racine</span>
          <div style={{ width: 40 }} />
        </div>

        <ChatWindow
          messages={messagesToDisplay}
          loading={loading}
        />

        {errorMsg && (
          <p className="chat-error">{errorMsg}</p>
        )}

        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  )
}

export default ChatPage
