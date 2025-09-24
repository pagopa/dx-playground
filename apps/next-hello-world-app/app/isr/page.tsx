interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  views: number;
}

// Simulazione di fetch dei dati con informazioni che cambiano nel tempo
async function getPostsWithStats(): Promise<Post[]> {
  // Simula un delay di rete
  await new Promise(resolve => setTimeout(resolve, 200));

  // Simula dati che cambiano nel tempo (views casuali)
  const posts: Post[] = [
    {
      id: 1,
      title: "Post ISR Dinamico",
      content: "Questo contenuto viene rigenerato ogni 30 secondi utilizzando ISR (Incremental Static Regeneration).",
      createdAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 1000) + 100
    },
    {
      id: 2,
      title: "Aggiornamenti Automatici",
      content: "ISR combina i benefici di SSG con la flessibilità di aggiornamenti automatici dei contenuti.",
      createdAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 800) + 50
    },
    {
      id: 3,
      title: "Performance e Freschezza",
      content: "Con ISR ottieni prestazioni eccellenti mantenendo i contenuti aggiornati senza rebuild completi.",
      createdAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 1200) + 200
    }
  ];

  return posts;
}

export const revalidate = 30; // Rivalida ogni 30 secondi

export default async function ISRPage() {
  const posts = await getPostsWithStats();
  const lastGenerated = new Date().toLocaleString('it-IT');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Incremental Static Regeneration (ISR)
          </h1>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">🔄 Caratteristiche ISR:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Rigenerazione automatica in background</li>
              <li>• Prestazioni di SSG + contenuti freschi</li>
              <li>• Rivalidazione configurabile (ogni 30 secondi)</li>
              <li>• Nessun downtime durante gli aggiornamenti</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            ⏰ Informazioni di Generazione
          </h2>
          <p className="text-gray-600">
            Ultima generazione: <strong>{lastGenerated}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Questa pagina si rigenera automaticamente ogni 30 secondi quando viene richiesta.
          </p>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-700">
              💡 <strong>Prova:</strong> Ricarica la pagina più volte per vedere i dati delle "visualizzazioni" cambiare!
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            📊 Posts con Dati Dinamici
          </h2>

          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {post.title}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  👁️ {post.views} views
                </span>
              </div>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="text-sm text-gray-500">
                Aggiornato il: {new Date(post.createdAt).toLocaleString('it-IT')}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mr-4"
          >
            ← Torna alla Home
          </a>
          <a
            href="/isr"
            className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            🔄 Ricarica Pagina
          </a>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🚀 Come Funziona ISR
          </h3>
          <div className="text-gray-600 space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <p><strong>1. Prima Richiesta:</strong> Serve la pagina cached (se esiste)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p><strong>2. Background:</strong> Verifica se è tempo di rigenerare (30s)</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p><strong>3. Rigenerazione:</strong> Fetch dei nuovi dati e rebuild della pagina</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p><strong>4. Aggiornamento:</strong> Le richieste successive vedranno il contenuto aggiornato</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-700">
              <strong>Configurazione:</strong> <code className="bg-blue-100 px-2 py-1 rounded">export const revalidate = 30</code>
              imposta la rivalidazione ogni 30 secondi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
