const core = require('@actions/core');
const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const { Transform } = require('stream');

async function run() {
  try {
    // 1. LEGGI L'INPUT DAL WORKFLOW
    // Il nome 'working-directory' deve corrispondere a quello definito in action.yml
    const workingDir = core.getInput('working-directory', { required: true });

    const logFile = 'plan_output.txt';
    const filterString = 'hidden-link:';

    core.info(`Azione avviata.`);
    core.info(`Working Directory: ${workingDir}`); // Log per debug
    core.info(`L'output verrà scritto anche su ${logFile}`);

    const logStream = createWriteStream(logFile);

    const command = 'stdbuf';
    const args = ['-oL', 'terraform', 'plan', '-lock-timeout=3000s', '-no-color'];

    // 2. USA L'INPUT COME CWD PER SPAWN
    const terraformProcess = spawn(command, args, { cwd: workingDir });

    // ... il resto dello script rimane identico ...

    const lineFilter = new Transform({ /* ... */ });
    terraformProcess.stdout.pipe(lineFilter).on('data', (data) => { /* ... */ });
    terraformProcess.stderr.on('data', (data) => { /* ... */ });
    terraformProcess.on('close', (code) => { /* ... */ });
    terraformProcess.on('error', (err) => { /* ... */ });

  } catch (error) {
    core.setFailed(error.message);
  }
}

// Incolla qui il resto del codice da `lineFilter` in poi,
// è identico alla versione precedente. Lo ometto per brevità.

// --- Blocco di codice da incollare ---
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

terraformProcess.stdout.pipe(lineFilter).on('data', (data) => {
    process.stdout.write(data);
    logStream.write(data);
});

terraformProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
    logStream.write(data);
});

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
// --- Fine blocco di codice ---


run();