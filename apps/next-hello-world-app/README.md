# 🚀 Next.js Rendering Patterns Showcase

Una demo completa dei pattern di rendering di Next.js 15 con esempi pratici per **SSG**, **ISR**, **SSR** e **CSR**.

## 📋 Panoramica

Questo progetto dimostra i 4 principali pattern di rendering disponibili in Next.js:

- **🟢 SSG (Static Site Generation)** - Pre-renderizzazione al build time
- **🔄 ISR (Incremental Static Regeneration)** - SSG + aggiornamenti automatici
- **🖥️ SSR (Server-Side Rendering)** - Rendering ad ogni richiesta
- **🌐 CSR (Client-Side Rendering)** - Rendering nel browser

## 🎯 Struttura del Progetto

```
app/
├── page.tsx              # Homepage con navigazione
├── ssg/page.tsx          # Demo Static Site Generation  
├── isr/page.tsx          # Demo Incremental Static Regeneration
├── ssr/page.tsx          # Demo Server-Side Rendering
├── csr/page.tsx          # Demo Client-Side Rendering
├── comparison/page.tsx   # Confronto dettagliato dei pattern
└── api/
    └── data/route.ts     # API endpoint per simulare dati dinamici
```

## 🛠️ Tech Stack

- **Next.js 15** - Framework React con App Router
- **React 19** - Libreria UI con ultime funzionalità
- **TypeScript** - Type safety e developer experience
- **Tailwind CSS 4** - Styling utility-first
- **Turbopack** - Build tool veloce di nuova generazione

## 🚀 Setup e Installazione

1. **Vai alla directory:**
   ```bash
   cd apps/next-hello-world-app
   ```

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo:**
   ```bash
   npm run dev
   ```

4. **Apri il browser:**
   ```
   http://localhost:3000
   ```

## 📖 Pattern di Rendering Spiegati

### 🟢 Static Site Generation (SSG)
**File:** `/app/ssg/page.tsx`

- **Quando:** Build time
- **Aggiornamenti:** Richiede nuovo deploy
- **Performance:** ⚡ Eccellente
- **SEO:** ✅ Perfetto
- **Uso ideale:** Blog, landing pages, documentazione

### 🔄 Incremental Static Regeneration (ISR)
**File:** `/app/isr/page.tsx`

- **Quando:** Build time + rivalidazioni periodiche
- **Aggiornamenti:** Automatici in background
- **Performance:** ⚡ Eccellente con contenuti freschi
- **SEO:** ✅ Perfetto
- **Uso ideale:** E-commerce, news, social media

### 🖥️ Server-Side Rendering (SSR)
**File:** `/app/ssr/page.tsx`

- **Quando:** Ad ogni richiesta
- **Aggiornamenti:** Sempre aggiornato
- **Performance:** 🟡 Buona (dipende dal server)
- **SEO:** ✅ Ottimo
- **Uso ideale:** Dashboard personalizzati, dati real-time

### 🌐 Client-Side Rendering (CSR)
**File:** `/app/csr/page.tsx`

- **Quando:** Nel browser dopo il caricamento
- **Aggiornamenti:** Interattivi e immediati
- **Performance:** 🔴 Slow first load, poi veloce
- **SEO:** ❌ Problematico
- **Uso ideale:** Admin panels, app interattive, SPA

## 🎨 Funzionalità Demo

### 🏠 Homepage
- Navigazione verso tutte le demo
- Spiegazione concetti base
- Design moderno e responsive

### 📊 Pagina SSG
- Posts statici generati al build
- Timestamp di generazione
- Esempi di contenuto ottimizzato per SEO

### 🔄 Pagina ISR
- Dati che si aggiornano ogni 30 secondi
- Simulazione views che cambiano
- Ricarica per vedere nuovi dati

### 👤 Pagina SSR
- Dashboard utente personalizzato
- Dati generati server-side ad ogni richiesta
- URL parameters per simulare utenti diversi

### ✅ Pagina CSR
- Task manager interattivo completamente client-side
- Aggiunta/rimozione task in real-time
- Statistiche aggiornate dinamicamente
- Loading state simulato

### 📋 Pagina Confronto
- Tabella comparativa completa
- Matrice di decisione per scegliere il pattern
- Pro/contro di ogni approccio
- Use cases specifici

## 🚦 Scripts Disponibili

- `npm run dev` - Server di sviluppo (con Turbopack)
- `npm run build` - Build di produzione
- `npm start` - Server di produzione

## 🎯 Quando Usare Cosa?

| Pattern | Performance | SEO | Real-time | Costo Server | Caso d'Uso |
|---------|-------------|-----|-----------|--------------|-------------|
| **SSG** | ⚡⚡⚡ | ✅ | ❌ | 💚 Basso | Blog, landing pages |
| **ISR** | ⚡⚡⚡ | ✅ | 🟡 Periodico | 🟡 Medio | E-commerce, news |
| **SSR** | ⚡⚡ | ✅ | ✅ | 🔴 Alto | Dashboard, personalizzazione |
| **CSR** | ⚡ | ❌ | ✅ | 💚 Basso | Admin panels, SPA |

---

**Divertiti esplorando i pattern di rendering Next.js! 🚀**
