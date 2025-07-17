
import { prisma } from '../lib/prisma'

async function main() {
  await prisma.defaultAnswer.createMany({
    data: [
      { keywords: 'hola', response: '¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte?' },
      { keywords: 'nombre', response: 'Me llamo ChatBot Asistente, un bot de ayuda virtual.' },
      { keywords: 'hora', response: `La hora actual es ${new Date().toLocaleTimeString()}.` },
      { keywords: 'fecha', response: `Hoy es ${new Date().toLocaleDateString()}.` },
      { keywords: 'gracias', response: '¡De nada! Estoy aquí para ayudarte. 😊' },
      { keywords: 'adiós,chau,chao', response: '¡Hasta luego! Que tengas un gran día.' },
      { keywords: 'clima', response: 'No tengo acceso al clima en tiempo real, pero puedes consultar weather.com.' },
      { keywords: 'quién te creó', response: 'Fui creado por Dylan Porras como parte de un proyecto técnico.' },
      { keywords: 'cuántos años tienes', response: 'No tengo edad física, pero siempre estoy actualizado 🧠.' },
      { keywords: 'qué puedes hacer', response: 'Puedo ayudarte a responder preguntas básicas, simular una conversación, y ser un asistente amigable.' },
    ],
  })

  console.log('Default answers seeded ✅')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
