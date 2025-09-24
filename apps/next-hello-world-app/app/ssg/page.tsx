interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// Simulazione di fetch dei dati - in un'app reale questo sarebbe una chiamata API o database
async function getPosts(): Promise<Post[]> {
  // Simula un delay di rete
  await new Promise(resolve => setTimeout(resolve, 100));

  const posts: Post[] = [
    {
      id: 1,
      title: "Primo Post SSG",
      content: "Questo contenuto è stato generato al momento del build utilizzando Static Site Generation (SSG).",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Secondo Post SSG",
      content: "SSG pre-renderizza le pagine al momento del build per ottenere prestazioni ottimali.",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Terzo Post SSG",
      content: "Le pagine SSG sono perfette per contenuti che non cambiano frequentemente.",
      createdAt: new Date().toISOString()
    }
  ];

  return posts;
}

export default async function SSGPage() {
  const posts = await getPosts();
  const buildTime = new Date().toLocaleString('it-IT');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Static Site Generation (SSG)
          </h1>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">📈 Caratteristiche SSG:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Pagina pre-renderizzata al momento del build</li>
              <li>• Prestazioni ottimali - servita da CDN</li>
              <li>• SEO perfetto</li>
              <li>• Ideale per contenuti statici o poco frequenti</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            ⏰ Informazioni di Build
          </h2>
          <p className="text-gray-600">
            Questa pagina è stata generata al: <strong>{buildTime}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Il contenuto rimarrà lo stesso fino al prossimo build dell'applicazione.
          </p>
        </div>

        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            📝 Posts Generati Staticamente
          </h2>

          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="text-sm text-gray-500">
                Creato il: {new Date(post.createdAt).toLocaleString('it-IT')}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            ← Torna alla Home
          </a>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🔧 Come Funziona SSG
          </h3>
          <div className="text-gray-600 space-y-2">
            <p>
              <strong>1. Build Time:</strong> Next.js esegue questa funzione durante il build
            </p>
            <p>
              <strong>2. Pre-rendering:</strong> Genera HTML statico con i dati
            </p>
            <p>
              <strong>3. Deployment:</strong> L'HTML viene servito direttamente dal server/CDN
            </p>
            <p>
              <strong>4. Performance:</strong> Caricamento istantaneo, nessuna attesa per API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
