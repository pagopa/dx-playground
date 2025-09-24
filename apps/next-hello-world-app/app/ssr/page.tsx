import { headers } from 'next/headers';

interface UserData {
  id: number;
  name: string;
  email: string;
  lastLogin: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

// Simulazione di fetch dei dati utente personalizzati
async function getUserData(userId: string): Promise<UserData> {
  // Simula un delay di rete
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simula dati personalizzati che cambiano ad ogni richiesta
  const userData: UserData = {
    id: parseInt(userId) || 1,
    name: `Utente ${userId || '1'}`,
    email: `user${userId || '1'}@example.com`,
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: Math.random() > 0.5 ? 'dark' : 'light',
      language: Math.random() > 0.5 ? 'it' : 'en',
      notifications: Math.random() > 0.5
    }
  };

  return userData;
}

export default async function SSRPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const resolvedSearchParams = await searchParams;
  const userId = typeof resolvedSearchParams.user === 'string' ? resolvedSearchParams.user : '1';

  // Fetch dei dati ad ogni richiesta (SSR)
  const userData = await getUserData(userId);
  const requestTime = new Date().toLocaleString('it-IT');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Server-Side Rendering (SSR)
          </h1>
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">🖥️ Caratteristiche SSR:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Renderizzazione ad ogni richiesta</li>
              <li>• Dati sempre aggiornati e personalizzati</li>
              <li>• Perfetto per contenuti dinamici</li>
              <li>• Accesso completo ai dati del server</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            ⏰ Informazioni Richiesta
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Renderizzato il:</strong> {requestTime}</p>
              <p><strong>User ID:</strong> {userId}</p>
            </div>
            <div>
              <p><strong>User Agent:</strong> {userAgent.substring(0, 50)}...</p>
              <p><strong>Tipo:</strong> Server-Side Rendering</p>
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">
            💡 Ogni ricarica genera nuovi dati personalizzati!
          </p>
        </div>

        {/* User Dashboard Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            👤 Dashboard Utente Personalizzato
            <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Real-time
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Informazioni Utente</h3>
              <div className="space-y-2">
                <p><strong>Nome:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>ID:</strong> #{userData.id}</p>
                <p><strong>Ultimo accesso:</strong> {new Date(userData.lastLogin).toLocaleString('it-IT')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Preferenze</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="mr-2">🎨 <strong>Tema:</strong></span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    userData.preferences.theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'bg-yellow-200 text-gray-800'
                  }`}>
                    {userData.preferences.theme}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🌍 <strong>Lingua:</strong></span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {userData.preferences.language.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🔔 <strong>Notifiche:</strong></span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    userData.preferences.notifications
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData.preferences.notifications ? 'Attive' : 'Disattive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔗 Prova con Utenti Diversi
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(id => (
              <a
                key={id}
                href={`/ssr?user=${id}`}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Utente {id}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Ogni link genererà dati personalizzati diversi per simulare un dashboard utente reale.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors mr-4"
          >
            ← Torna alla Home
          </a>
          <a
            href="/ssr"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            🔄 Ricarica (Nuovi Dati)
          </a>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🚀 Vantaggi di SSR per questo Caso d'Uso
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">✅ Pro:</h4>
              <ul className="space-y-1">
                <li>• Dati sempre aggiornati</li>
                <li>• Contenuti personalizzati per utente</li>
                <li>• SEO ottimo (se pubblico)</li>
                <li>• Sicurezza server-side</li>
                <li>• Accesso a headers/cookies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">⚠️ Considerazioni:</h4>
              <ul className="space-y-1">
                <li>• Latenza più alta di SSG/ISR</li>
                <li>• Maggior carico sul server</li>
                <li>• Richiede server sempre attivo</li>
                <li>• Costi di hosting più alti</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
