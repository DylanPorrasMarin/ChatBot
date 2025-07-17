import Head from 'next/head'
import ChatBox from '../components/ChatBox'


export default function Home() {
  return (
    <>
      <Head>
        <title>Mini ChatBot</title>
        <meta name="description" content="ChatBot desarrollado para la prueba técnica" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6 text-gray-700">Bienvenido al Asistente Virtual</h1>
          <ChatBox />
        </div>
      </main>
    </>
  )
}
