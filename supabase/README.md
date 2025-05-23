# 8-bit Draw Supabase Setup

This directory contains the database schema and migrations for the 8-bit Draw pixel art editor application.

## Overview

The database schema consists of the following tables:

- **profiles**: Extends Supabase auth.users with additional user information and avatar
- **drawings**: Stores metadata about pixel art drawings
- **drawing_data**: Stores the actual pixel data for drawings
- **votes**: Tracks user upvotes and downvotes for drawings
- **winners**: Tracks daily and weekly drawing winners

## Database Schema Design Decisions

### Drawing Data Separation

The drawing_data table is intentionally separated from the drawings table for several reasons:

1. **Performance**: The metadata (in the drawings table) is accessed much more frequently than the pixel data. When listing drawings in a gallery, we only need the metadata, not the full pixel data.

2. **Version History**: Having a separate table allows us to store multiple versions of the same drawing, which enables features like version history, undo/redo, and recovery.

3. **Size Efficiency**: Pixel data can be quite large, especially for complex drawings. Separating it allows for more efficient database operations.

### Publishing Model

Rather than having separate boolean flags for publishing status, we use a single `published_at` timestamp field:

- When `published_at` is `null`, the drawing is considered unpublished/private
- When `published_at` has a value, the drawing is published with that timestamp

This simplifies queries and ensures we always know when a drawing was published.

### Remix Relationship

We use a single `is_remix_of` field that references another drawing's ID. This provides a clear parent-child relationship for remix tracking without needing multiple fields.

## Setup Instructions

1. Create a Supabase project at [https://supabase.com](https://supabase.com)

2. Configure environment variables in your project:

   - Create a `.env` file with the following variables:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. To manually apply migrations to your Supabase project:

   - Install the Supabase CLI: `npm install -g supabase`
   - Link your project: `supabase link --project-ref your-project-id`
   - Apply migrations: `supabase db push`

4. Alternatively, you can manually run the SQL scripts in the Supabase SQL editor:

   - Go to your Supabase dashboard
   - Navigate to the SQL editor
   - Copy and paste the contents of each migration file and execute them in order (by timestamp)

5. Set up storage buckets for avatars:
   - Create a new storage bucket called 'avatars'
   - Configure public access for this bucket to allow avatar display

## Row Level Security (RLS) Policies

The database is configured with Row Level Security to ensure users can only access their own data or publicly published drawings. The key policies are:

- Users can only view and modify their own profiles
- Users can only view and modify their own drawings
- Published drawings (with published_at not null) are viewable by everyone
- Users can vote on any published drawing but can only change their own votes
- Winners are viewable by everyone

## Database Functions

The following database functions are available:

- `apply_vote(user_id, drawing_id, vote_type)`: Applies an upvote or downvote to a drawing
- `remove_vote(user_id, drawing_id)`: Removes a user's vote from a drawing
- `calculate_daily_winners(target_date)`: Calculates and stores the winner for a specific day
- `calculate_weekly_winners(end_date)`: Calculates and stores the winner for a specific week

## Automatic Winner Calculation

The database includes triggers that automatically calculate winners:

- Daily winners are calculated each day for the previous day
- Weekly winners are calculated each Monday for the previous week

## Type Definitions

TypeScript type definitions for the database schema are available in `src/types/supabase.ts`. These types are used by the Supabase client to provide type safety when interacting with the database.

## Voting System

The application uses an upvote/downvote system that calculates a score for each drawing:

- Each upvote adds 1 to the score
- Each downvote subtracts 1 from the score
- Each drawing tracks upvotes, downvotes, and the total score
- Daily and weekly winners are determined by the highest score during the period
- Leaderboards can be viewed to see the current top drawings
