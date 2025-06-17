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
      STDBUF: '-oL -eL',
      // Force unbuffered output for various tools
      TERM: 'dumb',
      // Ensure output is not buffered
      FORCE_COLOR: '0'
    };

    const terraformProcess = spawn(command, args, { 
      cwd: workingDir,
      env: env,
      // Use inherit for stdin, pipe for stdout/stderr to capture but maintain real-time
      stdio: ['pipe', 'pipe', 'pipe'],
      // Disable any Node.js buffering
      windowsHide: true
    });

    // Output data immediately as it arrives, without waiting for newlines
    terraformProcess.stdout.on('data', (chunk) => {
      const data = chunk.toString();
      if (data.trim()) {
        // Split by any type of line ending and output each part
        const lines = data.split(/\r?\n/);
        lines.forEach((line, index) => {
          if (line.trim()) {
            core.info(line);
          } else if (index < lines.length - 1) {
            // Empty line in the middle, preserve it
            core.info('');
          }
        });
      }
    });

    terraformProcess.stderr.on('data', (chunk) => {
      const data = chunk.toString();
      if (data.trim()) {
        // Split by any type of line ending and output each part
        const lines = data.split(/\r?\n/);
        lines.forEach((line, index) => {
          if (line.trim()) {
            // Terraform warnings and some info go to stderr, so we'll treat them as info unless they contain error keywords
            if (line.toLowerCase().includes('error') || line.toLowerCase().includes('failed')) {
              core.error(line);
            } else {
              core.warning(line);
            }
          } else if (index < lines.length - 1) {
            // Empty line in the middle, preserve it
            core.warning('');
          }
        });
      }
    });

    terraformProcess.on('close', (code) => {
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