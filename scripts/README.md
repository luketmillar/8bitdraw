# Supabase Project Management Scripts

This directory contains scripts to help you manage your Supabase project context when working on the 8bitdraw app.

## Setup Instructions

### Option 1: Use direnv (Recommended)

[direnv](https://direnv.net/) is a tool that automatically loads and unloads environment variables depending on the current directory. It's the most seamless way to switch between Supabase projects.

1. **Install direnv**

   - macOS: `brew install direnv`
   - Ubuntu: `sudo apt install direnv`
   - Others: [See direnv installation docs](https://direnv.net/docs/installation.html)

2. **Set up direnv hook in your shell**
   Add this to your `~/.bashrc` or `~/.zshrc`:

   ```bash
   eval "$(direnv hook bash)"  # for bash
   eval "$(direnv hook zsh)"   # for zsh
   ```

3. **Run the direnv setup script**

   ```bash
   ./scripts/direnv-setup.sh
   ```

4. **Configure your Supabase project**
   Edit the `.supaenv` file in the root directory and add your Supabase project reference.

Now whenever you navigate to this directory, your shell will automatically switch to the correct Supabase project context.

### Option 2: Manual Switching

If you prefer not to use direnv, you can manually switch projects:

1. **Configure your Supabase project**
   Edit the `.supaenv` file in the root directory and add your Supabase project reference.

2. **Switch when needed**
   ```bash
   ./scripts/supabase-switch.sh
   ```

## Available Scripts

### `supabase-init.sh`

This script initializes your Supabase project with all the required database tables and configurations:

```bash
./scripts/supabase-init.sh
```

It will:

- Link to your Supabase project
- Apply all database migrations
- Create the avatars storage bucket
- Set proper permissions
- Show your project status

### `supabase-switch.sh`

A simple script to switch to your 8bitdraw Supabase project:

```bash
./scripts/supabase-switch.sh
```

### `auto-switch.sh`

Used by direnv to automatically switch projects when you enter the directory.

### `direnv-setup.sh`

Sets up direnv for automatic project switching.

## Configuration

All Supabase project configuration is stored in the `.supaenv` file in the root directory. Edit this file to set your:

- `PROJECT_REF` - Your Supabase project reference
- `PROJECT_NAME` - Display name for your project
- `SUPABASE_URL` - URL to your Supabase instance
- `SUPABASE_ANON_KEY` - Anonymous API key for your project
