const core = require('@actions/core');
const { spawn } = require('child_process');

async function run() {
  try {
    const workingDir = core.getInput('working-directory', { required: true });
    
    core.info('Azione avviata (Tentativo finale con il comando `script`).');
    core.info(`Working Directory: ${workingDir}`);

    const command = 'script';
    const args = [
      '-qef', // Combiniamo le opzioni -q, -e, -f
      '/dev/null',
      'terraform',
      'plan',
      '-lock-timeout=3000s'
      // Non usiamo -no-color, sperando che il TTY di `script` li gestisca
    ];

    const scriptProcess = spawn(command, args, { cwd: workingDir });

    let lineBuffer = '';
    scriptProcess.stdout.on('data', (chunk) => {
      lineBuffer += chunk.toString();
      let eolIndex;
      while ((eolIndex = lineBuffer.indexOf('\n')) >= 0) {
        const line = lineBuffer.substring(0, eolIndex).trimEnd();
        lineBuffer = lineBuffer.substring(eolIndex + 1);
        core.info(line); // Forza la stampa di ogni singola riga
      }
    });

    // È importante catturare anche stderr, anche se `script` dovrebbe ridirigere tutto su stdout
    let stderrOutput = '';
    scriptProcess.stderr.on('data', (data) => {
      stderrOutput += data.toString();
    });

    scriptProcess.on('close', (code) => {
      // Stampa eventuali dati rimasti nel buffer
      if (lineBuffer.trim()) {
        core.info(lineBuffer.trim());
      }
      if (stderrOutput.trim()) {
        core.error('Output ricevuto su stderr (inaspettato):');
        core.error(stderrOutput);
      }
      
      core.info(`Processo 'script' terminato con codice ${code}.`);
      if (code !== 0) {
        core.setFailed(`Il comando Terraform è fallito con codice di uscita ${code}.`);
      } else {
        core.info('Azione completata con successo.');
      }
    });

    scriptProcess.on('error', (err) => {
      core.setFailed(`Errore nell'avvio del processo 'script': ${err.message}. Assicurarsi che sia installato nel runner.`);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();