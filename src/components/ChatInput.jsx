import { useState, useRef } from 'react'

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    // Auto-resize textarea
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 140) + 'px'
    }
  }

  return (
    <div className="chat-input-area">
      <form onSubmit={handleSubmit}>
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Posez votre question sur la riziculture..."
            className="chat-textarea"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="chat-send-btn"
            title="Envoyer (Entrée)"
          >
            {disabled ? (
              <span style={{ fontSize: '0.8rem', animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>⟳</span>
            ) : (
              '↑'
            )}
          </button>
        </div>
        <p className="chat-hint">Entrée pour envoyer · Maj+Entrée pour un saut de ligne</p>
      </form>
    </div>
  )
}

export default ChatInput
