import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🚀 Next.js Rendering Patterns
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Esplora e comprendi i 4 principali pattern di rendering di Next.js 15
            attraverso demo interattive e spiegazioni dettagliate.
          </p>
        </div>

        {/* Rendering Patterns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* SSG Card */}
          <Link
            href="/ssg"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600">
                SSG
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Static Site Generation
              </p>
              <div className="bg-green-50 rounded-lg p-3 text-xs text-green-700">
                <strong>Build time</strong><br/>
                Prestazioni ottimali
              </div>
            </div>
          </Link>

          {/* ISR Card */}
          <Link
            href="/isr"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">
                ISR
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Incremental Static Regeneration
              </p>
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                <strong>Build + Revalidation</strong><br/>
                Contenuti sempre freschi
              </div>
            </div>
          </Link>

          {/* SSR Card */}
          <Link
            href="/ssr"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🖥️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600">
                SSR
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Server-Side Rendering
              </p>
              <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-700">
                <strong>Request time</strong><br/>
                Dati personalizzati
              </div>
            </div>
          </Link>

          {/* CSR Card */}
          <Link
            href="/csr"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-yellow-500 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600">
                CSR
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Client-Side Rendering
              </p>
              <div className="bg-yellow-50 rounded-lg p-3 text-xs text-yellow-700">
                <strong>Browser</strong><br/>
                Interattività ricca
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Resources */}
        <div className="text-center mb-12">
          <Link
            href="/comparison"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            📊 Confronta Tutti i Pattern
          </Link>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Quale Pattern Scegliere?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Per Performance e SEO:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm"><strong>SSG:</strong> Blog, landing pages, documentazione</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm"><strong>ISR:</strong> E-commerce, news, social media</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Per Dinamicità:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm"><strong>SSR:</strong> Dashboard personalizzati, dati real-time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm"><strong>CSR:</strong> Admin panels, app interattive, SPA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Creato con Next.js 15, React 19, TypeScript e Tailwind CSS 4</p>
          <p className="mt-2">🚀 Esplora ogni demo per vedere i pattern in azione!</p>
        </div>
      </div>
    </div>
  );
}
