#!/bin/bash

# Build script for opex-dashboard-ts
# This script works around npm configuration issues by using alternative methods

echo "🏗️  Building opex-dashboard-ts..."

# Check if TypeScript compiler is available
if ! command -v tsc &> /dev/null; then
    echo "❌ TypeScript compiler not found. Please install TypeScript globally:"
    echo "   npm install -g typescript"
    exit 1
fi

# Create dist directory
mkdir -p dist

# Compile TypeScript
echo "📝 Compiling TypeScript..."
tsc

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
    echo "📦 Build output in dist/ directory"

    # Make CLI executable
    if [ -f "dist/cli/index.js" ]; then
        chmod +x dist/cli/index.js
        echo "🔧 Made CLI executable"
    fi

    echo ""
    echo "🚀 To test the implementation:"
    echo "   node dist/cli/index.js generate --help"
    echo ""
    echo "📊 To generate a dashboard:"
    echo "   node dist/cli/index.js generate \\"
    echo "     --template-name azure-dashboard-raw \\"
    echo "     --config-file examples/azure_dashboard_config.yaml"

else
    echo "❌ TypeScript compilation failed!"
    exit 1
fi
