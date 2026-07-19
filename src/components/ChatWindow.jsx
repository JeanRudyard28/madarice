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
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h1 className="text-base font-semibold text-white mt-2 mb-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold text-white mt-2 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-white mt-2 mb-1">{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs text-cyan-300">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-cyan-400/40 pl-3 text-gray-400 italic mb-2 last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-white/10 my-3" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2 last:mb-0 rounded-xl border border-white/10">
      <table className="min-w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/5">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/10">{children}</tbody>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="text-left font-semibold text-cyan-400 px-3 py-2 whitespace-nowrap border-r border-white/10 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-gray-300 align-top border-r border-white/10 last:border-r-0">
      {children}
    </td>
  ),
}

const ChatWindow = ({ messages = [], loading = false }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`text-sm leading-relaxed ${
              message.role === 'user'
                ? 'max-w-xl px-5 py-3 rounded-2xl bg-cyan-400 text-gray-950 rounded-br-none whitespace-pre-wrap'
                : 'max-w-2xl px-5 py-3 rounded-2xl bg-gray-900 text-gray-200 border border-white/10 rounded-bl-none'
            }`}
          >
            {message.role === 'user' ? (
              message.content
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-900 text-gray-400 border border-white/10 rounded-2xl rounded-bl-none px-5 py-3 text-sm flex items-center gap-1">
            <span className="animate-bounce [animation-delay:-0.3s]">•</span>
            <span className="animate-bounce [animation-delay:-0.15s]">•</span>
            <span className="animate-bounce">•</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow

// import { useEffect, useRef } from 'react'

// const ChatWindow = ({ messages = [], loading = false }) => {
//   const bottomRef = useRef(null)

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages, loading])

//   return (
//     <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
//       {messages.map((message) => (
//         <div
//           key={message.id}
//           className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//         >
//           <div
//             className={`max-w-xl px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
//               message.role === 'user'
//                 ? 'bg-cyan-400 text-gray-950 rounded-br-none'
//                 : 'bg-gray-900 text-gray-200 border border-white/10 rounded-bl-none'
//             }`}
//           >
//             {message.content}
//           </div>
//         </div>
//       ))}

//       {loading && (
//         <div className="flex justify-start">
//           <div className="bg-gray-900 text-gray-400 border border-white/10 rounded-2xl rounded-bl-none px-5 py-3 text-sm flex items-center gap-1">
//             <span className="animate-bounce [animation-delay:-0.3s]">•</span>
//             <span className="animate-bounce [animation-delay:-0.15s]">•</span>
//             <span className="animate-bounce">•</span>
//           </div>
//         </div>
//       )}

//       <div ref={bottomRef} />
//     </div>
//   )
// }

// export default ChatWindow
