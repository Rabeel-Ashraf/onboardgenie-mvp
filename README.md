# OnboardGenie – AI Client Onboarding MVP

An AI-powered onboarding tool for freelancers and agencies.

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Auth, DB)
- GPT-4
- Notion Integration
- TypeScript + Tailwind + Shadcn

## Setup

1. `cp .env.example .env.local`
2. Fill in your Supabase, OpenAI, and Notion keys
3. Run the SQL schema in Supabase (see below)
4. `npm install && npm run dev`

## Supabase SQL Schema

Run this in Supabase SQL Editor:

```sql
create table services (
  id uuid primary key default uuid_generate_v4(),
  name text not null
);

insert into services (name) values ('Web Design'), ('Brand Identity'), ('SEO Audit'), ('Content Writing');

create table flows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  title text not null,
  service_type text,
  questions jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table shares (
  id uuid primary key default uuid_generate_v4(),
  flow_id uuid not null references flows(id),
  token text unique not null,
  expires_at timestamptz,
  password_hash text,
  uses int default 0,
  max_uses int default 1
);

create table responses (
  id uuid primary key default uuid_generate_v4(),
  share_token text not null,
  data jsonb not null,
  submitted_at timestamptz default now()
);

create table summaries (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid not null references responses(id),
  summary text not null,
  timeline text not null,
  tasks jsonb not null,
  generated_at timestamptz default now()
);

```bash
git add .
git commit -m "feat: add full OnboardGenie MVP"
git push origin main


cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">OnboardGenie</h1>
      <p className="mt-4">AI-powered client onboarding for freelancers & agencies.</p>
      <div className="mt-8">
        <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded">Log In</a>
      </div>
    </div>
  )
}
