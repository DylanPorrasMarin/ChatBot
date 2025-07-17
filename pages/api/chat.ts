import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

type Data = {
  answer: string
  suggestions?: string[]
}

// Función para eliminar tildes, comas, mayúsculas, etc.
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // descompone letras con tildes
    .replace(/[\u0300-\u036f]/g, '') // elimina los acentos
    .replace(/[^\w\s]/gi, '') // elimina puntuación
    .trim()
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
    await prisma.message.create({ data: { sender: 'bot', text: saludo } })
    return res.status(200).json({ answer: saludo })
  }

  const userInput = normalizeText(message)

  await prisma.message.create({
    data: { sender: 'user', text: message },
  })

  const defaultAnswers = await prisma.defaultAnswer.findMany()

  let matchResponse = ''
  let suggestions: string[] = []

  for (const answer of defaultAnswers) {
    const keywords = answer.keywords
      .split(',')
      .map(k => normalizeText(k))

    if (keywords.some(keyword => userInput === keyword || userInput.includes(keyword))) {
      matchResponse = answer.response
      break
    }
  }

  if (!matchResponse) {
    const suggestionSet = new Set<string>()

    for (const answer of defaultAnswers) {
      const keywords = answer.keywords
        .split(',')
        .map(k => normalizeText(k))

      for (const keyword of keywords) {
        const baseWord = keyword.split(' ')[0]
        if (userInput.includes(baseWord)) {
          suggestionSet.add(keyword)
        }
      }
    }

    suggestions = Array.from(suggestionSet)

    matchResponse = suggestions.length > 0
      ? `Lo siento, no entendí completamente. ¿Quizás quisiste preguntar sobre: ${suggestions.join(', ')}?`
      : 'Lo siento, no comprendí tu consulta. Intenta con otra pregunta.'
  }

  await prisma.message.create({
    data: { sender: 'bot', text: matchResponse },
  })

  await new Promise(resolve => setTimeout(resolve, 800))

  return res.status(200).json({ answer: matchResponse, suggestions })
}
