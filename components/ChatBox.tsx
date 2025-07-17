import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface Message {
  sender: 'user' | 'bot'
  text: string
}

export default function ChatBox() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mensaje inicial en el frontend y lo registra en BD
    const initialMessage: Message = {
      sender: 'bot',
      text: '¡Hola! Soy tu asistente virtual. Puedes preguntarme cosas como la hora, el clima, quién me creó, entre otras. 😊',
    }

    setMessages([initialMessage])

    axios.post('/api/chat', { message: '__init__' }).catch(() => {
      console.error('Error al registrar el saludo inicial')
    })
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage: Message = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const res = await axios.post('/api/chat', { message: input })
      const botMessage: Message = { sender: 'bot', text: res.data.answer }
      setMessages(prev => [...prev, botMessage])
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error en el servidor.' }])
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white border rounded-2xl shadow-lg flex flex-col h-[50vh] sm:h-[600px]">
        <div className="bg-blue-600 text-white text-lg font-semibold px-4 py-3 rounded-t-2xl">
          ChatBot Asistente
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[60vh] sm:max-h-[450px]">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex p-3 border-t gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
