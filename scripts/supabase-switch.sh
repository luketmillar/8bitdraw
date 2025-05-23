#!/bin/bash

# supabase-switch.sh
# Helper script for switching between Supabase projects

# Set this to your 8bitdraw Supabase project reference (found in your Supabase dashboard)
PROJECT_REF="jpmrtxoqiiiboprntuon"
PROJECT_NAME="8bitdraw"

# Function to switch to the project
switch_project() {
  echo "🔄 Switching to Supabase project: ${PROJECT_NAME} (${PROJECT_REF})"
  
  # Check if Supabase CLI is installed
  if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
  fi
  
  # Link to the project
  supabase link --project-ref "${PROJECT_REF}"
  
  if [ $? -eq 0 ]; then
    echo "✅ Successfully switched to ${PROJECT_NAME} Supabase project"
    
    # Get project status
    echo "📊 Project status:"
    supabase status
  else
    echo "❌ Failed to switch Supabase project"
    exit 1
  fi
}

# Execute
switch_project 