import { useState } from 'react'

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-white/10">
      <div className="flex items-center gap-3 bg-gray-900 border border-white/10 rounded-2xl px-4 py-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="Posez votre question sur la riziculture..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="bg-cyan-400 text-gray-950 px-4 py-2 rounded-xl text-sm font-medium hover:bg-cyan-300 transition disabled:opacity-40 disabled:hover:bg-cyan-400"
        >
          {disabled ? '...' : 'Envoyer'}
        </button>
      </div>
    </form>
  )
}

export default ChatInput
