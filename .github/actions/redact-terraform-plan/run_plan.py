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
    """
    Executes `terraform plan` in the current working directory
    and redacts the output in real-time.
    """
    command = ["terraform", "plan", "-no-color", "-input=false"]

    # The subprocess now runs in the current directory, which is set
    # by the 'cd' command in the action.yml's run step.
    # The `cwd` parameter is no longer needed.
    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding='utf-8'
    )

    if process.stdout:
        for line in process.stdout:
            sys.stdout.write(redact(line))

    process.wait()
    return process.returncode

if __name__ == "__main__":
    run_terraform_plan()
