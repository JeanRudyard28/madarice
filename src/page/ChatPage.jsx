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
      setErrorMsg("Impossible de contacter Felana pour le moment. Vérifiez la connexion au workflow n8n.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow
          messages={activeConversation?.messages || []}
          loading={loading}
        />
        {errorMsg && (
          <p className="text-red-400 text-xs text-center px-6 pb-2">{errorMsg}</p>
        )}
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  )
}

export default ChatPage
