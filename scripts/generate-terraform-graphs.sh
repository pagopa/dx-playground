#!/bin/bash
set -e

if ! command -v dot &> /dev/null; then
    echo "Please install Graphviz, use the command:"
    echo "  - brew install graphviz"
    exit 1
fi

if [ $# -eq 0 ]; then
    echo "No .tf files changed. Skip this hook."
    exit 0
fi

DIRECTORIES=$(dirname -- "$@" | sort -u)

echo "Directory with changes:"
echo "$DIRECTORIES"
echo "---"

for DIR in $DIRECTORIES; do
    echo "🔄 Graph generation in: $DIR"
    
    (cd "$DIR" && terraform init && terraform graph > graph.dot)
    
    echo "✅ File graph.dot generated"
    echo "---"
done