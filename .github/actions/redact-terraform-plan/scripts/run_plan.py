import sys
import re
import subprocess

# ==============================================================================
#  REDACTION RULES LIST
# ==============================================================================
# To add a new rule, add a tuple to this list.
# The format is: (compiled_regex, replacement_string)
#
# - 'compiled_regex': The regex pattern to find the sensitive data.
# - 'replacement_string': The string to replace the found data with.
#
REDACTION_RULES = [
    # --- Azure Rules ---
    # Finds "hidden-link" attributes and redacts their value.
    (re.compile(r'("?hidden-link"?\s*[:=]\s*)".*?"', re.IGNORECASE), r'\1"[REDACTED_HIDDEN_LINK]"'),

    # Finds "APPINSIGHTS_INSTRUMENTATIONKEY" attributes and redacts their value.
    (re.compile(r'("?APPINSIGHTS_INSTRUMENTATIONKEY"?\s*[:=]\s*)".*?"', re.IGNORECASE), r'\1"[REDACTED_INSTRUMENTATION_KEY]"'),

    # --- ADD YOUR AZURE RULES HERE ---


    # --- Generic Rules ---
    # Example: (re.compile(r'("|_|-)password("|_|-) = ".*"', re.IGNORECASE), r'\1password\2 = "[SENSITIVE]"'),
    # --- ADD YOUR GENERIC RULES HERE ---


    # --- AWS Rules ---
    # --- ADD YOUR AWS RULES HERE ---
]

def redact(line):
    """Applies all redaction rules to a single line of text."""
    redacted_line = line
    for pattern, replacement in REDACTION_RULES:
        redacted_line = pattern.sub(replacement, redacted_line)
    return redacted_line

def run_terraform_plan():
    """Executes `terraform plan` and redacts the output in real-time."""
    # The command to be executed
    command = ["terraform", "plan", "-no-color", "-input=false"]

    # Start the subprocess
    # stdout and stderr are redirected to the same pipe
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8')

    # Read the output line by line as it comes
    if process.stdout:
        for line in process.stdout:
            # Redact the line and print it to the standard output
            sys.stdout.write(redact(line))

    # Wait for the process to terminate
    process.wait()

    # Return the exit code from the terraform command
    return process.returncode

if __name__ == "__main__":
    # The action.yml will handle the exit code.
    # This script's only job is to print the redacted output.
    run_terraform_plan()

