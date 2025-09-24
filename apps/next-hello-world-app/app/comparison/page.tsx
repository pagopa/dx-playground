export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Confronto Rendering Patterns
          </h1>
          <p className="text-xl text-gray-600">
            SSG vs ISR vs SSR vs CSR - Quando usare quale pattern
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* SSG Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Static Site Generation (SSG)
                </h2>
                <p className="text-gray-600">Pre-renderizzazione al build time</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✅ Pro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Prestazioni ottimali</li>
                  <li>• SEO perfetto</li>
                  <li>• Caching semplice</li>
                  <li>• Sicurezza elevata</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2">❌ Contro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Contenuto statico</li>
                  <li>• Rebuild per aggiornamenti</li>
                  <li>• Non adatto per dati dinamici</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">🎯 Ideale per:</h3>
                <p className="text-gray-600 text-sm">
                  Blog, landing pages, documentazione, siti vetrina
                </p>
              </div>
            </div>
          </div>

          {/* ISR Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Incremental Static Regeneration (ISR)
                </h2>
                <p className="text-gray-600">SSG + aggiornamenti automatici</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✅ Pro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Prestazioni di SSG</li>
                  <li>• Contenuti aggiornati</li>
                  <li>• Nessun downtime</li>
                  <li>• Scalabile</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2">❌ Contro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Complessità maggiore</li>
                  <li>• Possibili contenuti stantii</li>
                  <li>• Cache invalidation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">🎯 Ideale per:</h3>
                <p className="text-gray-600 text-sm">
                  E-commerce, news, social media, dashboard
                </p>
              </div>
            </div>
          </div>

          {/* SSR Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <span className="text-2xl">🖥️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Server-Side Rendering (SSR)
                </h2>
                <p className="text-gray-600">Rendering ad ogni richiesta</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✅ Pro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Contenuti sempre freschi</li>
                  <li>• SEO ottimo</li>
                  <li>• Dati personalizzati</li>
                  <li>• Sicurezza server-side</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2">❌ Contro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Latenza più alta</li>
                  <li>• Carico server maggiore</li>
                  <li>• Complessità deployment</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">🎯 Ideale per:</h3>
                <p className="text-gray-600 text-sm">
                  App personalizzate, dashboard utente, real-time data
                </p>
              </div>
            </div>
          </div>

          {/* CSR Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Client-Side Rendering (CSR)
                </h2>
                <p className="text-gray-600">Rendering nel browser</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✅ Pro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Interattività ricca</li>
                  <li>• Navigazione veloce</li>
                  <li>• Meno carico server</li>
                  <li>• Sviluppo semplice</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2">❌ Contro:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• SEO problematico</li>
                  <li>• First load lento</li>
                  <li>• Bundle size grande</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">🎯 Ideale per:</h3>
                <p className="text-gray-600 text-sm">
                  SPA, admin panels, app interne, gaming
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 Confronto Performance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left">Metrica</th>
                  <th className="py-3 px-4 text-green-600">SSG</th>
                  <th className="py-3 px-4 text-blue-600">ISR</th>
                  <th className="py-3 px-4 text-purple-600">SSR</th>
                  <th className="py-3 px-4 text-yellow-600">CSR</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-left font-medium">First Contentful Paint</td>
                  <td className="py-3 px-4">🟢 Eccellente</td>
                  <td className="py-3 px-4">🟢 Eccellente</td>
                  <td className="py-3 px-4">🟡 Buono</td>
                  <td className="py-3 px-4">🔴 Lento</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-left font-medium">SEO</td>
                  <td className="py-3 px-4">🟢 Perfetto</td>
                  <td className="py-3 px-4">🟢 Perfetto</td>
                  <td className="py-3 px-4">🟢 Ottimo</td>
                  <td className="py-3 px-4">🔴 Problematico</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-left font-medium">Freshness dei Dati</td>
                  <td className="py-3 px-4">🔴 Statici</td>
                  <td className="py-3 px-4">🟡 Periodici</td>
                  <td className="py-3 px-4">🟢 Real-time</td>
                  <td className="py-3 px-4">🟢 Real-time</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-left font-medium">Server Load</td>
                  <td className="py-3 px-4">🟢 Minimo</td>
                  <td className="py-3 px-4">🟡 Basso</td>
                  <td className="py-3 px-4">🔴 Alto</td>
                  <td className="py-3 px-4">🟢 Minimo</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-left font-medium">Scalabilità</td>
                  <td className="py-3 px-4">🟢 Eccellente</td>
                  <td className="py-3 px-4">🟢 Ottima</td>
                  <td className="py-3 px-4">🟡 Media</td>
                  <td className="py-3 px-4">🟢 Buona</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Decision Matrix */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Matrice di Decisione
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📈 Contenuto che cambia raramente
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Blog posts</span>
                  <span className="text-green-600 font-semibold">SSG</span>
                </div>
                <div className="flex justify-between">
                  <span>Documentazione</span>
                  <span className="text-green-600 font-semibold">SSG</span>
                </div>
                <div className="flex justify-between">
                  <span>Landing pages</span>
                  <span className="text-green-600 font-semibold">SSG</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                🔄 Contenuto che cambia periodicamente
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>E-commerce catalog</span>
                  <span className="text-blue-600 font-semibold">ISR</span>
                </div>
                <div className="flex justify-between">
                  <span>News feed</span>
                  <span className="text-blue-600 font-semibold">ISR</span>
                </div>
                <div className="flex justify-between">
                  <span>Social media</span>
                  <span className="text-blue-600 font-semibold">ISR</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                ⚡ Contenuto personalizzato/Real-time
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>User dashboard</span>
                  <span className="text-purple-600 font-semibold">SSR</span>
                </div>
                <div className="flex justify-between">
                  <span>Chat applications</span>
                  <span className="text-yellow-600 font-semibold">CSR</span>
                </div>
                <div className="flex justify-between">
                  <span>Analytics</span>
                  <span className="text-purple-600 font-semibold">SSR</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                🎮 App altamente interattive
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Admin panels</span>
                  <span className="text-yellow-600 font-semibold">CSR</span>
                </div>
                <div className="flex justify-between">
                  <span>Games</span>
                  <span className="text-yellow-600 font-semibold">CSR</span>
                </div>
                <div className="flex justify-between">
                  <span>Rich editors</span>
                  <span className="text-yellow-600 font-semibold">CSR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors text-lg"
          >
            ← Torna alla Home
          </a>
        </div>
      </div>
    </div>
  );
}
