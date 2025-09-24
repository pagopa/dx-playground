import { NextResponse } from 'next/server';

export async function GET() {
  // Simula il fetch di dati dinamici
  const data = {
    timestamp: new Date().toISOString(),
    randomNumber: Math.floor(Math.random() * 1000),
    message: 'Questi dati cambiano ad ogni richiesta',
    serverTime: new Date().toLocaleString('it-IT'),
  };

  return NextResponse.json(data);
}
