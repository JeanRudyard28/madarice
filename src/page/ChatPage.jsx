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

  // Charge les métadonnées d'historique (titres/ids) sans charger les anciens messages dans ChatWindow
  useEffect(() => {
    const loadData = async () => {
      setErrorMsg('')
      if (user && user.token) {
        setLoading(true)
        try {
          const backendConvs = await getBackendConversations(user.token)
          if (backendConvs.length > 0) {
            // Conserve l'historique sans précharger les anciens messages dans ChatWindow
            const convsWithoutLoadedMessages = backendConvs.map((c) => ({ ...c, messages: [] }))
            setConversations(convsWithoutLoadedMessages)
            setActiveId(convsWithoutLoadedMessages[0].id)
          } else {
            const newConv = await createBackendConversation("Nouvelle conversation", user.id, user.token)
            newConv.messages = []
            setConversations([newConv])
            setActiveId(newConv.id)
          }
        } catch (err) {
          setErrorMsg("Impossible de charger l'historique depuis le serveur.")
        } finally {
          setLoading(false)
        }
      } else {
        // Mode invité
        const initial = getOrCreateInitialConversation()
        const stored = getConversations().map((c) => ({ ...c, messages: [] }))
        setConversations(stored.length > 0 ? stored : [{ ...initial, messages: [] }])
        setActiveId(initial.id)
      }
    }
    loadData()
  }, [user])

  const activeConversation = conversations.find((c) => c.id === activeId) || null

  const handleNewConversation = async () => {
    setErrorMsg('')
    setSidebarOpen(false)
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
      setConversations(getConversations().map((c) => (c.id === conv.id ? { ...c, messages: [] } : c)))
      setActiveId(conv.id)
    }
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
        if (remaining.length === 0) {
          const newConv = await createBackendConversation("Nouvelle conversation", user.id, user.token)
          newConv.messages = []
          setConversations([newConv])
          setActiveId(newConv.id)
        } else {
          setConversations(remaining)
          if (activeId === id) {
            setActiveId(remaining[0].id)
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
        setConversations([{ ...conv, messages: [] }])
        setActiveId(conv.id)
      } else {
        setConversations(remaining.map((c) => ({ ...c, messages: [] })))
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
        const userMsg = await createBackendMessage(activeConversation.id, text, 'user', user.token)
        const updatedMessages = [...currentMessages, userMsg]

        let updatedTitle = activeConversation.title
        if (isFirstUserMessage) {
          updatedTitle = titleFromMessage(text)
          await updateBackendConversation(activeConversation.id, updatedTitle, user.token)
        }

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? { ...c, title: updatedTitle, messages: updatedMessages }
              : c
          )
        )

        const { output } = await sendChatMessage(text, activeConversation.id)
        const assistantMsg = await createBackendMessage(activeConversation.id, output, 'assistant', user.token)

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
      const currentMessages = activeConversation.messages || []
      const isFirstUserMessage = !currentMessages.some((m) => m.role === 'user')

      const updatedMessages = [...currentMessages, userMessage]
      const updated = updateConversation(activeConversation.id, {
        messages: updatedMessages,
        title: isFirstUserMessage ? titleFromMessage(text) : activeConversation.title,
      })
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: updatedMessages } : c))
      )
      setLoading(true)

      try {
        const { output } = await sendChatMessage(text, activeConversation.sessionId || activeConversation.id)
        const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', content: output }
        const finalMessages = [...updatedMessages, assistantMessage]
        updateConversation(activeConversation.id, {
          messages: finalMessages,
        })
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: finalMessages } : c))
        )
      } catch (err) {
        setErrorMsg("Impossible de contacter Riziculture Solutions pour le moment. Vérifiez la connexion au workflow n8n.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Ne pas précharger de messages stockés par défaut :
  // Si aucun message n'a été envoyé dans la session active, messagesToDisplay reste []
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
