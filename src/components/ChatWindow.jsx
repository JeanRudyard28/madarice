import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-2 last:mb-0 flex flex-col gap-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-2 last:mb-0 flex flex-col gap-1">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#e2e8f0' }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
  h1: ({ children }) => <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2e8f0', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-cyan)', textDecoration: 'underline' }}>
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.8rem', color: '#67e8f9', fontFamily: 'monospace' }}>
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '2px solid rgba(34,211,238,0.4)', paddingLeft: '0.75rem', color: 'var(--clr-muted)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
      {children}
    </blockquote>
  ),
  hr: () => <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '0.75rem 0' }} />,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '0.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <table style={{ minWidth: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: 'rgba(255,255,255,0.04)' }}>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{children}</tr>,
  th: ({ children }) => <th style={{ textAlign: 'left', fontWeight: 600, color: 'var(--clr-cyan)', padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8', verticalAlign: 'top' }}>{children}</td>,
}

const ChatWindow = ({ messages = [], loading = false }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) {
    return (
      <div className="chat-window" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="chat-empty">
          <div className="chat-empty-icon">🌾</div>
          <div className="chat-empty-title">Bonjour ! Je suis Riziculture Solutions</div>
          <div className="chat-empty-subtitle">
            Posez-moi vos questions sur la riziculture à Madagascar
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-window">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message-row ${message.role}`}
        >
          <div className={`message-bubble ${message.role}`}>
            {message.role === 'user' ? (
              <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="message-row assistant">
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow
