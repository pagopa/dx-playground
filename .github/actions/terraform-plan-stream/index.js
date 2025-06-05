const core = require('@actions/core');
const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const { Transform } = require('stream');

async function run() {
  try {
    const logFile = 'plan_output.txt';
    const filterString = 'hidden-link:';

    core.info(`Azione avviata nella dir ${process.cwd()}. L'output verrà scritto anche su ${logFile}`);

    const logStream = createWriteStream(logFile);

    // Manteniamo stdbuf come best practice per essere sicuri al 100%
    // che il processo figlio stesso non stia bufferizzando.
    const command = 'stdbuf';
    const args = ['-oL', 'terraform', 'plan', '-lock-timeout=3000s', '-no-color'];
    const terraformProcess = spawn(command, args);

    const lineFilter = new Transform({
      transform(chunk, encoding, callback) {
        const lines = (this.carry || '' + chunk.toString()).split(/\r?\n/);
        this.carry = lines.pop();
        for (const line of lines) {
          if (!line.includes(filterString)) {
            this.push(line + '\n');
          }
        }
        callback();
      },
      flush(callback) {
        if (this.carry && !this.carry.includes(filterString)) {
          this.push(this.carry);
        }
        callback();
      }
    });

    // Usiamo core.info per il logging, che è il modo idiomatico per un'azione.
    // Questo potrebbe avere un comportamento di flushing diverso e più affidabile.
    terraformProcess.stdout.pipe(lineFilter).on('data', (data) => {
        process.stdout.write(data); // Scrive direttamente allo stdout del processo Node
        logStream.write(data);
    });

    terraformProcess.stderr.on('data', (data) => {
        process.stderr.write(data); // Scrive direttamente allo stderr del processo Node
        logStream.write(data);
    });
    
    // Gestione della conclusione del processo
    terraformProcess.on('close', (code) => {
      logStream.end();
      if (code !== 0) {
        core.setFailed(`Il processo Terraform è terminato con codice ${code}`);
      } else {
        core.info('Processo Terraform completato con successo.');
      }
    });

    terraformProcess.on('error', (err) => {
        logStream.end();
        core.setFailed(`Errore nell'avvio del processo: ${err.message}`);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();