const core = require('@actions/core');
const { spawn } = require('child_process');

async function run() {
  try {
    const workingDir = core.getInput('working-directory', { required: true });
    
    core.info('Azione avviata (Streaming real-time output).');
    core.info(`Working Directory: ${workingDir}`);

    const command = 'terraform';
    const args = ['plan', '-lock-timeout=3000s'];

    core.info(`Esecuzione del comando: ${command} ${args.join(' ')}`);

    // Environment variables to force unbuffered output
    const env = {
      ...process.env,
      // Force Terraform to use colored output even in non-TTY environments
      TF_CLI_ARGS: '-no-color',
      // Disable output buffering
      PYTHONUNBUFFERED: '1',
      // Force line buffering
      STDBUF: '-oL -eL'
    };

    const terraformProcess = spawn(command, args, { 
      cwd: workingDir,
      env: env,
      // Use pipe to capture output while maintaining real-time streaming
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let lineBuffer = '';
    terraformProcess.stdout.on('data', (chunk) => {
      const data = chunk.toString();
      lineBuffer += data;
      
      let eolIndex;
      while ((eolIndex = lineBuffer.indexOf('\n')) >= 0) {
        const line = lineBuffer.substring(0, eolIndex).trimEnd();
        lineBuffer = lineBuffer.substring(eolIndex + 1);
        if (line.trim()) {
          core.info(line);
        }
      }
      
      // Also flush any partial line immediately for truly real-time output
      if (lineBuffer.trim() && !lineBuffer.includes('\n')) {
        core.info(lineBuffer.trim());
        lineBuffer = '';
      }
    });

    let stderrBuffer = '';
    terraformProcess.stderr.on('data', (chunk) => {
      const data = chunk.toString();
      stderrBuffer += data;
      
      let eolIndex;
      while ((eolIndex = stderrBuffer.indexOf('\n')) >= 0) {
        const line = stderrBuffer.substring(0, eolIndex).trimEnd();
        stderrBuffer = stderrBuffer.substring(eolIndex + 1);
        if (line.trim()) {
          // Terraform warnings and some info go to stderr, so we'll treat them as info unless they contain error keywords
          if (line.toLowerCase().includes('error') || line.toLowerCase().includes('failed')) {
            core.error(line);
          } else {
            core.warning(line);
          }
        }
      }
      
      // Flush partial stderr lines immediately too
      if (stderrBuffer.trim() && !stderrBuffer.includes('\n')) {
        if (stderrBuffer.toLowerCase().includes('error') || stderrBuffer.toLowerCase().includes('failed')) {
          core.error(stderrBuffer.trim());
        } else {
          core.warning(stderrBuffer.trim());
        }
        stderrBuffer = '';
      }
    });

    terraformProcess.on('close', (code) => {
      // Output any remaining buffered content
      if (lineBuffer.trim()) {
        core.info(lineBuffer.trim());
      }
      if (stderrBuffer.trim()) {
        if (stderrBuffer.toLowerCase().includes('error') || stderrBuffer.toLowerCase().includes('failed')) {
          core.error(stderrBuffer.trim());
        } else {
          core.warning(stderrBuffer.trim());
        }
      }
      
      core.info(`Processo terraform terminato con codice ${code}.`);
      if (code !== 0) {
        core.setFailed(`Il comando terraform plan è fallito con codice di uscita ${code}.`);
      } else {
        core.info('Terraform plan completato con successo.');
      }
    });

    terraformProcess.on('error', (err) => {
      core.setFailed(`Errore nell'avvio del processo terraform: ${err.message}`);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();