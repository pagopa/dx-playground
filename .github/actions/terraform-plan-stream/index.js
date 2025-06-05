const core = require('@actions/core');
const pty = require('node-pty');
const { createWriteStream } = require('fs');

async function run() {
  let ptyProcess; // Definiamo qui per accedervi nel blocco catch

  // ** DIAGNOSTICA: HEARTBEAT **
  // Stampa un messaggio ogni 5 secondi per verificare se l'event loop di Node.js
  // e il logging di Actions funzionano in tempo reale.
  const heartbeat = setInterval(() => {
    core.info(`[Heartbeat] L'azione è ancora in esecuzione... ${new Date().toLocaleTimeString()}`);
  }, 5000);

  try {
    const workingDir = core.getInput('working-directory', { required: true });
    const logFile = 'plan_output.txt';
    const filterString = 'hidden-link:';

    core.info('Azione avviata (Versione diagnostica con Heartbeat).');
    core.info(`Working Directory: ${workingDir}`);

    const logStream = createWriteStream(logFile);
    
    const command = 'terraform';
    const args = ['plan', '-lock-timeout=3000s'];

    // Avvia il processo usando pty.spawn
    ptyProcess = pty.spawn(command, args, {
      name: 'xterm-color',
      cols: 120, // Diamo più colonne, a volte aiuta
      rows: 30,
      cwd: workingDir,
      env: process.env
    });

    let lineBuffer = '';
    // L'evento di node-pty si chiama 'onData'
    ptyProcess.onData(chunk => {
      // Non usiamo più process.stdout.write.
      // Processiamo ogni chunk per trovare le righe complete.
      lineBuffer += chunk.toString();
      let eolIndex;
      while ((eolIndex = lineBuffer.indexOf('\n')) >= 0) {
        const line = lineBuffer.substring(0, eolIndex).trimEnd();
        lineBuffer = lineBuffer.substring(eolIndex + 1);

        // **CHIAMATA FORZATA AL LOG PER OGNI RIGA**
        setTimeout(() => {
          core.info(line);
        }, 0); // Assicuriamoci che il log venga eseguito in modo asincrono

        // Scrittura su file (con filtro e pulizia colori)
        if (!line.includes(filterString)) {
          const cleanLine = line.replace(/[\u001b\u009b][[()#;?]*.?[0-9]{1,4}(?:;[0-9]{0,4})*.?[0-9A-ORZcf-nqry=><]/g, '');
          logStream.write(cleanLine + '\n');
        }
      }
    });

    // Gestisce la conclusione del processo
    ptyProcess.onExit(({ exitCode }) => {
      // Ferma l'heartbeat
      clearInterval(heartbeat);

      // Processa e logga eventuali dati rimasti nel buffer
      if (lineBuffer.length > 0) {
        core.info(lineBuffer);
        if (!lineBuffer.includes(filterString)) {
            const cleanBuffer = lineBuffer.replace(/[\u001b\u009b][[()#;?]*.?[0-9]{1,4}(?:;[0-9]{0,4})*.?[0-9A-ORZcf-nqry=><]/g, '');
            logStream.write(cleanBuffer);
        }
      }

      logStream.end();
      if (exitCode !== 0) {
        core.setFailed(`Il processo Terraform è terminato con codice ${exitCode}`);
      } else {
        core.info('Processo Terraform completato con successo.');
      }
    });

  } catch (error) {
    // Ferma l'heartbeat anche in caso di errore
    clearInterval(heartbeat);
    if (ptyProcess) {
      ptyProcess.kill();
    }
    core.setFailed(error.message);
  }
}

run();