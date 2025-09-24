'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  lastUpdated: string;
}

export default function CSRPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    lastUpdated: ''
  });

  // Simula il caricamento iniziale dei dati
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      // Simula una chiamata API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const initialTasks: Task[] = [
        {
          id: 1,
          title: 'Implementare componente React',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Testare funzionalità CSR',
          completed: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Ottimizzare performance client-side',
          completed: false,
          createdAt: new Date().toISOString()
        }
      ];

      setTasks(initialTasks);
      updateStats(initialTasks);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const updateStats = (taskList: Task[]) => {
    const total = taskList.length;
    const completed = taskList.filter(task => task.completed).length;
    const pending = total - completed;

    setStats({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      lastUpdated: new Date().toLocaleString('it-IT')
    });
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    updateStats(updatedTasks);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    updateStats(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    updateStats(updatedTasks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Caricamento Client-Side</h2>
          <p className="text-gray-600">Simulazione di fetch dati nel browser...</p>
          <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded inline-block">
            <p className="text-sm">🔄 I dati vengono caricati interamente lato client!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Client-Side Rendering (CSR)
          </h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">🌐 Caratteristiche CSR:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Renderizzazione completa nel browser</li>
              <li>• Interattività ricca e immediata</li>
              <li>• Navigazione fluida (SPA experience)</li>
              <li>• Meno carico sui server</li>
            </ul>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
            <div className="text-sm text-gray-600">Task Totali</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-sm text-gray-600">Completati</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
            <div className="text-sm text-gray-600">In Sospeso</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-xs text-gray-500">Ultimo Aggiornamento</div>
            <div className="text-sm font-medium text-gray-700">{stats.lastUpdated}</div>
          </div>
        </div>

        {/* Task Manager - Interactive Component */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            ✅ Task Manager Interattivo
            <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Real-time Updates
            </span>
          </h2>

          {/* Add Task Form */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Aggiungi un nuovo task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Aggiungi
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                  task.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                  />
                  <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nessun task presente. Aggiungi il tuo primo task!</p>
            </div>
          )}
        </div>

        {/* Real-time Feature Demo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔄 Funzionalità Real-time
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Interazioni Immediate:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ✅ Checkbox toggling senza reload</li>
                <li>• ➕ Aggiunta task dinamica</li>
                <li>• 🗑️ Eliminazione istantanea</li>
                <li>• 📊 Statistiche aggiornate in tempo reale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Benefici UX:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 🚀 Navigazione fluida</li>
                <li>• 💫 Feedback immediato</li>
                <li>• 📱 Esperienza app-like</li>
                <li>• 🎮 Interattività ricca</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors mr-4"
          >
            ← Torna alla Home
          </a>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            🔄 Ricarica App
          </button>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🎯 CSR vs Altri Pattern
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">✅ Ideale per CSR:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Admin dashboard e pannelli di controllo</li>
                <li>• Applicazioni con molta interattività</li>
                <li>• Tools e utilities interne</li>
                <li>• Gaming e multimedia apps</li>
                <li>• Real-time collaborative tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2">❌ Non ideale per:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Siti con focus su SEO</li>
                <li>• Landing pages marketing</li>
                <li>• Blog e siti di contenuto</li>
                <li>• E-commerce public-facing</li>
                <li>• Apps con dati critici iniziali</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
