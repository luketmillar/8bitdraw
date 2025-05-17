#!/bin/sh

# Create the .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-push hook
cp scripts/git-hooks/pre-push .git/hooks/
chmod +x .git/hooks/pre-push

echo "Git hooks installed successfully!" 