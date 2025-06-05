const core = require('@actions/core');
const pty = require('node-pty'); // <-- Importa node-pty
const { createWriteStream } = require('fs');

async function run() {
  try {
    const workingDir = core.getInput('working-directory', { required: true });
    const logFile = 'plan_output.txt';
    const filterString = 'hidden-link:';

    core.info('Azione avviata con emulazione TTY.');
    core.info(`Working Directory: ${workingDir}`);
    core.info(`L'output verrà filtrato e scritto anche su ${logFile}`);

    const logStream = createWriteStream(logFile);

    // Con node-pty, NON abbiamo più bisogno di stdbuf.
    // Il comando è direttamente terraform.
    const command = 'terraform';
    const args = ['plan', '-lock-timeout=3000s']; 
    // NON usare '-no-color', vogliamo i colori! Il log di GitHub li supporta.

    // Avvia il processo usando pty.spawn
    const ptyProcess = pty.spawn(command, args, {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: workingDir,
      env: process.env
    });

    let buffer = '';
    // L'evento di node-pty si chiama 'onData', non 'on('data')'
    ptyProcess.onData(chunk => {
      // Scrivi l'output grezzo (con colori) direttamente nel log di Actions.
      // Il viewer di GitHub Actions interpreterà correttamente i codici colore.
      process.stdout.write(chunk);
      
      // Ora gestiamo il buffer per il file di log e il filtro
      buffer += chunk.toString();
      let eolIndex;
      while ((eolIndex = buffer.indexOf('\n')) >= 0) {
        const line = buffer.substring(0, eolIndex).trimEnd();
        buffer = buffer.substring(eolIndex + 1);

        if (!line.includes(filterString)) {
          // Scrivi sul file di log senza codici colore (più pulito)
          // La regex rimuove i codici di escape ANSI
          const cleanLine = line.replace(/[\u001b\u009b][[()#;?]*.?[0-9]{1,4}(?:;[0-9]{0,4})*.?[0-9A-ORZcf-nqry=><]/g, '');
          logStream.write(cleanLine + '\n');
        }
      }
    });

    // Gestisce la conclusione del processo
    ptyProcess.onExit(({ exitCode }) => {
      // Processa eventuali dati rimasti nel buffer
      if (buffer.length > 0 && !buffer.includes(filterString)) {
        const cleanBuffer = buffer.replace(/[\u001b\u009b][[()#;?]*.?[0-9]{1,4}(?:;[0-9]{0,4})*.?[0-9A-ORZcf-nqry=><]/g, '');
        logStream.write(cleanBuffer);
      }
      logStream.end();
      if (exitCode !== 0) {
        core.setFailed(`Il processo Terraform è terminato con codice ${exitCode}`);
      } else {
        core.info('Processo Terraform completato con successo.');
      }
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();