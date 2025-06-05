const core = require('@actions/core');
const { spawn } = require('child_process');
const { createWriteStream } = require('fs');

async function run() {
  try {
    const workingDir = core.getInput('working-directory', { required: true });
    const logFile = 'plan_output.txt';
    const filterString = 'hidden-link:';

    core.info('Azione avviata.');
    core.info(`Working Directory: ${workingDir}`);
    core.info(`L'output verrà filtrato e scritto anche su ${logFile}`);

    const logStream = createWriteStream(logFile);
    
    // Comando e argomenti rimangono invariati
    const command = 'stdbuf';
    const args = ['-oL', 'terraform', 'plan', '-lock-timeout=3000s', '-no-color'];

    const terraformProcess = spawn(command, args, { cwd: workingDir });

    // **MODIFICA PRINCIPALE: Gestione manuale del buffer e logging per riga**
    let buffer = '';
    terraformProcess.stdout.on('data', (chunk) => {
      // Aggiungi il nuovo blocco di dati al buffer
      buffer += chunk.toString();
      
      // Processa il buffer finché contiene interruzioni di riga
      let eolIndex;
      while ((eolIndex = buffer.indexOf('\n')) >= 0) {
        // Estrai la riga completa (rimuovendo \r se presente)
        const line = buffer.substring(0, eolIndex).trimEnd();
        // Rimuovi la riga processata dal buffer
        buffer = buffer.substring(eolIndex + 1);

        // Filtra e logga la riga
        if (!line.includes(filterString)) {
          core.info(line); // <-- Chiamata chiave per l'output in tempo reale
          logStream.write(line + '\n');
        }
      }
    });

    // Gestisce lo stderr (invariato)
    terraformProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      // Scrivi su stderr per visualizzarlo come errore nel log di Actions
      process.stderr.write(dataStr); 
      logStream.write(dataStr);
    });
    
    // Gestisce la conclusione del processo
    terraformProcess.on('close', (code) => {
      // Processa eventuali dati rimasti nel buffer alla fine del processo
      if (buffer.length > 0 && !buffer.includes(filterString)) {
        core.info(buffer);
        logStream.write(buffer);
      }
      logStream.end();
      if (code !== 0) {
        core.setFailed(`Il processo Terraform è terminato con codice ${code}`);
      } else {
        core.info('Processo Terraform completato con successo.');
      }
    });

    // Gestisce eventuali errori nell'avvio del processo (invariato)
    terraformProcess.on('error', (err) => {
        logStream.end();
        core.setFailed(`Errore nell'avvio del processo: ${err.message}`);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();