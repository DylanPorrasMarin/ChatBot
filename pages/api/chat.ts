import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

type Data = {
  answer: string
  suggestions?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ answer: 'Método no permitido' })
  }

  const { message } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ answer: 'Mensaje inválido' })
  }

  // Saludo inicial
  if (message === '__init__') {
    const saludo = '¡Hola! Soy tu asistente virtual. Puedes preguntarme cosas como la hora, el clima, quién me creó, entre otras. 😊'
    await prisma.message.create({
      data: { sender: 'bot', text: saludo }
    })
    return res.status(200).json({ answer: saludo })
  }

  const lowerMessage = message.toLowerCase().trim()

  // Guardar mensaje del usuario
  await prisma.message.create({
    data: {
      sender: 'user',
      text: message,
    },
  })

  // Traer respuestas desde base de datos
  const defaultAnswers = await prisma.defaultAnswer.findMany()

  let matchResponse = ''
  let suggestions: string[] = []

  for (const answer of defaultAnswers) {
    const keywords = answer.keywords.split(',').map(k => k.trim().toLowerCase())
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      matchResponse = answer.response
      break
    }
  }

  if (!matchResponse) {
    // Si no hay coincidencia exacta, sugerir por coincidencia parcial
    for (const answer of defaultAnswers) {
      const keywords = answer.keywords.split(',').map(k => k.trim().toLowerCase())
      if (keywords.some(keyword => lowerMessage.includes(keyword.split(' ')[0]))) {
        suggestions.push(keywords[0])
      }
    }

    matchResponse = suggestions.length > 0
      ? `Lo siento, no entendí completamente. ¿Quizás quisiste preguntar sobre: ${suggestions.join(', ')}?`
      : 'Lo siento, no comprendí tu consulta. Intenta con otra pregunta.'
  }

  // Guardar respuesta del bot
  await prisma.message.create({
    data: {
      sender: 'bot',
      text: matchResponse,
    },
  })

  // Delay simulado
  await new Promise(resolve => setTimeout(resolve, 800))

  return res.status(200).json({ answer: matchResponse, suggestions })
}
