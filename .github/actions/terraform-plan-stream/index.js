const core = require('@actions/core');
const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const { Transform } = require('stream');

async function run() {
  try {
    // Legge l'input 'working-directory' definito in action.yml
    const workingDir = core.getInput('working-directory', { required: true });

    const logFile = 'plan_output.txt';
    const filterString = 'hidden-link:';

    core.info('Azione avviata.');
    core.info(`Working Directory: ${workingDir}`);
    core.info(`L'output verrà filtrato e scritto anche su ${logFile}`);

    // Crea lo stream per scrivere sul file di log
    const logStream = createWriteStream(logFile);

    // Comando da eseguire: usiamo stdbuf per forzare il line-buffering di terraform
    // e garantire lo streaming dell'output in tempo reale.
    const command = 'stdbuf';
    const args = ['-oL', 'terraform', 'plan', '-lock-timeout=3000s', '-no-color'];

    // Avvia il processo specificando la directory di lavoro
    const terraformProcess = spawn(command, args, { cwd: workingDir });

    // Crea uno stream di trasformazione per filtrare l'output
    const lineFilter = new Transform({
      transform(chunk, encoding, callback) {
        // Converte il blocco di dati in stringa e lo divide per righe.
        // La variabile 'carry' gestisce le righe incomplete tra un blocco e l'altro.
        const lines = (this.carry || '' + chunk.toString()).split(/\r?\n/);
        this.carry = lines.pop(); // L'ultima riga potrebbe essere incompleta

        for (const line of lines) {
          if (!line.includes(filterString)) {
            // Se la riga non contiene la stringa da filtrare, la inoltriamo
            // aggiungendo un a capo per mantenere la formattazione.
            this.push(line + '\n');
          }
        }
        callback();
      },
      // Funzione chiamata alla fine dello stream per processare eventuali dati rimasti
      flush(callback) {
        if (this.carry && !this.carry.includes(filterString)) {
          this.push(this.carry);
        }
        callback();
      }
    });

    // Collega (pipe) lo stdout del processo terraform al nostro filtro
    terraformProcess.stdout.pipe(lineFilter).on('data', (data) => {
      // Invia l'output filtrato allo stdout del processo principale dell'azione
      // in modo che appaia nel log di GitHub Actions.
      process.stdout.write(data);
      // Scrive contemporaneamente l'output filtrato sul file di log.
      logStream.write(data);
    });

    // Gestisce lo stderr: gli errori vengono mostrati e loggati senza filtro.
    terraformProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
      logStream.write(data);
    });
    
    // Gestisce la conclusione del processo
    terraformProcess.on('close', (code) => {
      logStream.end(); // Chiude lo stream del file
      if (code !== 0) {
        // Se il codice di uscita non è 0, l'azione fallisce.
        core.setFailed(`Il processo Terraform è terminato con codice ${code}`);
      } else {
        core.info('Processo Terraform completato con successo.');
      }
    });

    // Gestisce eventuali errori nell'avvio del processo stesso
    terraformProcess.on('error', (err) => {
        logStream.end();
        core.setFailed(`Errore nell'avvio del processo: ${err.message}`);
    });

  } catch (error) {
    // Cattura qualsiasi altro errore imprevisto nello script
    core.setFailed(error.message);
  }
}

// Esegue la funzione principale
run();