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

const ChatPage = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Charge la liste des conversations au démarrage sans en sélectionner une par défaut
  useEffect(() => {
    const loadData = async () => {
      setErrorMsg('')
      if (user && user.token) {
        setLoading(true)
        try {
          const backendConvs = await getBackendConversations(user.token)
          setConversations(backendConvs)
        } catch (err) {
          setErrorMsg("Impossible de charger l'historique depuis le serveur.")
        } finally {
          setLoading(false)
        }
      } else {
        // Mode invité (localStorage)
        const stored = getConversations()
        setConversations(stored)
      }
    }
    loadData()
  }, [user])

  // Charge les messages de la conversation active pour les utilisateurs connectés
  useEffect(() => {
    if (!activeId || !user || !user.token) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        const msgs = await getBackendMessages(activeId, user.token)
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, messages: msgs } : c))
        )
      } catch (err) {
        setErrorMsg("Impossible de charger les messages de cette conversation.")
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [activeId, user])

  const activeConversation = conversations.find((c) => c.id === activeId) || null

  const handleNewConversation = () => {
    setErrorMsg('')
    setSidebarOpen(false)
    setActiveId(null)
  }

  const handleSelectConversation = (id) => {
    setActiveId(id)
    setErrorMsg('')
    setSidebarOpen(false)
  }

  const handleDeleteConversation = async (id) => {
    setErrorMsg('')
    if (user && user.token) {
      setLoading(true)
      try {
        await deleteBackendConversation(id, user.token)
        const remaining = conversations.filter((c) => c.id !== id)
        setConversations(remaining)
        if (activeId === id) {
          setActiveId(null)
        }
      } catch (err) {
        setErrorMsg("Impossible de supprimer la conversation sur le serveur.")
      } finally {
        setLoading(false)
      }
    } else {
      const remaining = deleteConversation(id)
      setConversations(remaining)
      if (activeId === id) {
        setActiveId(null)
      }
    }
  }

  const handleSend = async (text) => {
    if (!text.trim()) return
    setErrorMsg('')

    if (user && user.token) {
      setLoading(true)
      try {
        let currentConv = activeConversation
        if (!currentConv) {
          currentConv = await createBackendConversation("Nouvelle conversation", user.id, user.token)
          currentConv.messages = []
          setConversations((prev) => [currentConv, ...prev])
          setActiveId(currentConv.id)
        }

        const currentMessages = currentConv.messages || []
        const isFirstUserMessage = !currentMessages.some((m) => m.role === 'user')

        const userMsg = await createBackendMessage(currentConv.id, text, 'user', user.token)
        const updatedMessages = [...currentMessages, userMsg]

        let updatedTitle = currentConv.title
        if (isFirstUserMessage) {
          updatedTitle = titleFromMessage(text)
          await updateBackendConversation(currentConv.id, updatedTitle, user.token)
        }

        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConv.id
              ? { ...c, title: updatedTitle, messages: updatedMessages }
              : c
          )
        )

        const { output } = await sendChatMessage(text, currentConv.id)
        const assistantMsg = await createBackendMessage(currentConv.id, output, 'assistant', user.token)

        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConv.id
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
      let currentConv = activeConversation
      if (!currentConv) {
        currentConv = createConversation()
        setConversations(getConversations())
        setActiveId(currentConv.id)
      }

      const userMessage = { id: crypto.randomUUID(), role: 'user', content: text }
      const currentMessages = currentConv.messages || []
      const isFirstUserMessage = !currentMessages.some((m) => m.role === 'user')

      const updatedMessages = [...currentMessages, userMessage]
      const updated = updateConversation(currentConv.id, {
        messages: updatedMessages,
        title: isFirstUserMessage ? titleFromMessage(text) : currentConv.title,
      })
      setConversations((prev) =>
        prev.map((c) => (c.id === currentConv.id ? { ...c, title: updated ? updated.title : c.title, messages: updatedMessages } : c))
      )
      setLoading(true)

      try {
        const { output } = await sendChatMessage(text, currentConv.id)
        const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', content: output }
        const finalMessages = [...updatedMessages, assistantMessage]
        updateConversation(currentConv.id, {
          messages: finalMessages,
        })
        setConversations((prev) =>
          prev.map((c) => (c.id === currentConv.id ? { ...c, messages: finalMessages } : c))
        )
      } catch (err) {
        setErrorMsg("Impossible de contacter Riziculture Solutions pour le moment. Vérifiez la connexion au workflow n8n.")
      } finally {
        setLoading(false)
      }
    }
  }

  const messagesToDisplay = activeConversation?.messages || []

  return (
    <div className="chat-page">
      {/* Drawer backdrop overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer panel d'historique */}
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
        {/* Topbar avec bouton toggle de l'historique en Drawer */}
        <div className="chat-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Ouvrir l'historique"
            title="Historique des conversations"
          >
            📜 <span className="menu-toggle-text">Historique</span>
          </button>
          <span className="chat-topbar-title">🌾 Riziculture Solutions</span>
          <button
            className="btn-new-chat-topbar"
            onClick={handleNewConversation}
            title="Nouvelle conversation"
          >
            ＋ <span className="btn-new-chat-text">Nouveau</span>
          </button>
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
