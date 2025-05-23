# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Git Hooks

This project includes Git hooks to ensure code quality. The pre-push hook runs TypeScript type checking before allowing pushes to prevent build errors from being committed.

To install the Git hooks:

```bash
# Run the installation script
./scripts/install-hooks.sh
```

After installation, Git will automatically run TypeScript type checking before each push. If there are any type errors, the push will be blocked until they are fixed.

To temporarily bypass the pre-push hook (not recommended):

```bash
git push --no-verify
```

## Supabase Setup

This project uses Supabase for authentication and database functionality. Follow these steps to set up Supabase for this project:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Create a `.env` file in the project root with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. In your Supabase project, enable Email authentication in the Authentication settings
4. Create a `profiles` table in the Supabase database with the following schema:

   ```sql
   create table public.profiles (
     id uuid not null primary key default uuid_generate_v4(),
     user_id uuid references auth.users not null,
     username text unique not null,
     avatar_url text,
     created_at timestamp with time zone default now() not null,

     constraint username_length check (char_length(username) >= 3)
   );

   -- Set up Row Level Security
   alter table public.profiles enable row level security;

   -- Create policies for profiles
   create policy "Public profiles are viewable by everyone."
     on profiles for select
     using ( true );

   create policy "Users can insert their own profile."
     on profiles for insert
     with check ( auth.uid() = user_id );

   create policy "Users can update their own profile."
     on profiles for update
     using ( auth.uid() = user_id );
   ```

5. After signing up, users will be prompted to create a profile with a unique username before they can access protected features.
