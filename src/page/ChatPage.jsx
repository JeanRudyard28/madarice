import { useEffect, useState } from 'react'
import ChatInput from "../components/ChatInput"
import ChatWindow from "../components/ChatWindow"
import Sidebar from "../components/Sidebar"
import { sendChatMessage } from '../lib/api'
import {
  getConversations,
  getOrCreateInitialConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  titleFromMessage,
} from '../lib/storage'

const ChatPage = () => {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Charge l'historique au montage (ou crée une première conversation)
  useEffect(() => {
    const initial = getOrCreateInitialConversation()
    setConversations(getConversations())
    setActiveId(initial.id)
  }, [])

  const activeConversation = conversations.find((c) => c.id === activeId) || null

  const handleNewConversation = () => {
    const conv = createConversation()
    setConversations(getConversations())
    setActiveId(conv.id)
  }

  const handleSelectConversation = (id) => {
    setActiveId(id)
    setErrorMsg('')
    setSidebarOpen(false)
  }

  const handleDeleteConversation = (id) => {
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

  const handleSend = async (text) => {
    if (!activeConversation || !text.trim()) return
    setErrorMsg('')

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

  const activeTitle = activeConversation?.title || 'Nouvelle conversation'

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
          messages={activeConversation?.messages || []}
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
