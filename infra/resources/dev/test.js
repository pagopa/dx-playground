import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { Transform } from 'stream';

// --- Configurazione ---
const logFile = 'plan_output.txt';
const terraformArgs = ['plan', '-lock-timeout=3000s', '-no-color'];
const filterString = 'hidden-link:';

// --- Creazione dello stream di scrittura per il file di log ---
const logStream = createWriteStream(logFile);

// --- Avvio del processo 'terraform' ---
const terraform = spawn('terraform', terraformArgs, {
  // Esegui il comando nella directory di lavoro originale
  cwd: process.env.INIT_CWD,
});

// --- Creazione di uno stream di trasformazione per il filtraggio ---
// Questo stream riceverà i dati, li filtrerà e li passerà oltre.
const lineFilter = new Transform({
  transform(chunk, encoding, callback) {
    // Converte il chunk di dati in una stringa e la divide per righe.
    // Il `carry` gestisce le righe incomplete tra un chunk e l'altro.
    const lines = (this.carry || '' + chunk.toString()).split(/\r?\n/);
    this.carry = lines.pop(); // L'ultima riga potrebbe essere incompleta, la teniamo da parte

    for (const line of lines) {
      if (!line.includes(filterString)) {
        // Se la riga non contiene la stringa da filtrare, la inoltriamo
        // aggiungendo un a capo per mantenere la formattazione.
        this.push(line + '\n');
      }
    }
    callback();
  },
  // La funzione flush viene chiamata alla fine dello stream
  // per processare eventuali dati rimasti nel buffer (l'ultima riga).
  flush(callback) {
    if (this.carry) {
        if (!this.carry.includes(filterString)) {
            this.push(this.carry);
        }
    }
    callback();
  }
});

// --- Gestione dello streaming ---

// 1. Collega (pipe) lo stdout di terraform allo stream di filtraggio
terraform.stdout.pipe(lineFilter);

// 2. Stampa l'output filtrato sulla console principale (process.stdout)
lineFilter.pipe(process.stdout);
//    ...e contemporaneamente scrivilo nel file di log
lineFilter.pipe(logStream);

// 3. Stampa lo stderr di terraform direttamente (gli errori non vengono filtrati)
terraform.stderr.pipe(process.stderr);
//    ...e contemporaneamente scrivilo nel file di log
terraform.stderr.pipe(logStream);

// --- Gestione degli errori e della chiusura dei processi ---

terraform.on('error', (err) => {
  console.error(`Errore nell'avvio di 'terraform': ${err.message}`);
  logStream.write(`Errore nell'avvio di 'terraform': ${err.message}\n`);
});

lineFilter.on('error', (err) => {
  console.error(`Errore durante il filtraggio dello stream: ${err.message}`);
  logStream.write(`Errore durante il filtraggio dello stream: ${err.message}\n`);
});

terraform.on('close', (code) => {
  if (code !== 0) {
    const message = `Il processo 'terraform' è terminato con codice ${code}`;
    console.log(message);
    logStream.write(message + '\n');
  }
  // Chiudi lo stream del file quando terraform ha finito
  logStream.end();
});