const core = require('@actions/core');
const { spawn } = require('child_process');

async function run() {
  try {
    const workingDir = core.getInput('working-directory', { required: true });
    
    core.info('Azione avviata (Tentativo con `script -c`).');
    core.info(`Working Directory: ${workingDir}`);

    const commandToRun = 'terraform plan -lock-timeout=3000s';
    
    const command = 'script';
    const args = [
      // Opzioni per 'script'. Separate per massima compatibilità.
      '-q', 
      '-e', 
      '-f',
      // File di output da scartare
      '/dev/null',
      // Flag che introduce il comando da eseguire
      '-c',
      // Il comando completo come singola stringa
      commandToRun
    ];

    core.info(`Esecuzione del comando: ${command} ${args.join(' ')}`);

    const scriptProcess = spawn(command, args, { cwd: workingDir });

    let lineBuffer = '';
    scriptProcess.stdout.on('data', (chunk) => {
      lineBuffer += chunk.toString();
      let eolIndex;
      while ((eolIndex = lineBuffer.indexOf('\n')) >= 0) {
        const line = lineBuffer.substring(0, eolIndex).trimEnd();
        lineBuffer = lineBuffer.substring(eolIndex + 1);
        core.info(line);
      }
    });

    let stderrOutput = '';
    scriptProcess.stderr.on('data', (data) => {
      // Qualsiasi output su stderr da 'script' è un errore nella configurazione
      stderrOutput += data.toString();
    });

    scriptProcess.on('close', (code) => {
      if (lineBuffer.trim()) {
        core.info(lineBuffer.trim());
      }
      if (stderrOutput.trim()) {
        core.error("Errore ricevuto durante l'esecuzione di 'script':");
        core.error(stderrOutput);
      }
      
      core.info(`Processo 'script' terminato con codice ${code}.`);
      if (code !== 0) {
        core.setFailed(`Il comando è fallito con codice di uscita ${code}. L'errore potrebbe essere visibile sopra.`);
      } else {
        core.info('Azione completata con successo.');
      }
    });

    scriptProcess.on('error', (err) => {
      core.setFailed(`Errore nell'avvio del processo 'script': ${err.message}.`);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();