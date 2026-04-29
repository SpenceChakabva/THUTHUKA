# Thuthuka — Tactical UCT Infrastructure

Privacy-first academic engine for high-performance UCT students. Manage your schedule, notes, exams, funding, and study plans with zero server-side tracking.

## Features

| Feature | Description |
|---------|-------------|
| **AI Study Planner** | Chat-based study advisor powered by Claude. Generates personalised study plans, exam strategies, and weekly schedules. |
| **Encrypted Storage** | All data encrypted at rest using AES-256-GCM via the Web Crypto API. Data never leaves your browser. |
| **Exam Planner** | Parse timetables, track papers, and plan revision. |
| **Schedule Manager** | View and manage your weekly course timetable. Export to `.ics`. |
| **Accommodation Checker** | Verify off-campus housing listings against known databases. |
| **NSFAS Calculator** | Calculate your funding gap and find bursary opportunities. |
| **Scratchpad** | Quick notes for lectures, admin, and life. |
| **Data Portability** | Export/import all data as JSON. Move between devices freely. |
| **Dark Mode** | Full light/dark theme support. |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, GSAP animations
- **Storage**: Encrypted localStorage (AES-256-GCM via Web Crypto API)
- **AI**: Claude API via Vercel serverless function
- **Deployment**: Vercel (static SPA + serverless API)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
git clone https://github.com/your-username/thuthuka.git
cd thuthuka
npm install
```

### Environment Variables

Copy the example env file and add your Anthropic API key:

```bash
cp .env.example .env.local
```

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a key at [console.anthropic.com](https://console.anthropic.com/).

The AI Planner works without a key — it will show a helpful error message prompting configuration.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the environment variable `ANTHROPIC_API_KEY` in the Vercel dashboard (Settings > Environment Variables)
4. Deploy

The `vercel.json` handles SPA routing and API function routing automatically.

## Architecture

```
src/
  lib/
    crypto.ts     # AES-256-GCM encryption engine (Web Crypto API)
    store.ts      # React state management + encrypted persistence
    ai.ts         # Claude API client helper
  pages/
    Landing.tsx   # Onboarding wizard
    Home.tsx      # Dashboard with contextual banners
    Planner.tsx   # AI study planner (chat interface)
    Calendar.tsx  # Timetable manager
    Exams.tsx     # Exam planner
    Notes.tsx     # Scratchpad
    Funding.tsx   # NSFAS calculator + bursary finder
    Accommodation.tsx  # Housing verification
    Profile.tsx   # Profile + data management
    About.tsx     # Feature overview
    Privacy.tsx   # Data sovereignty page
  components/
    layout/       # Sidebar, BottomTabBar, Layout
    ui/           # Button, Card, Input, Select, etc.
api/
  chat.ts         # Vercel serverless function (Claude API proxy)
```

## Security Model

- **Encryption at rest**: All student data is encrypted with AES-256-GCM before being written to localStorage. The encryption key is derived via PBKDF2 (100,000 iterations) from a per-device random salt.
- **No server storage**: Zero data is sent to any server. The only outbound call is the AI chat, which sends the current conversation + anonymised profile context to the Claude API.
- **No tracking**: No analytics, no cookies, no fingerprinting.
- **Data sovereignty**: Users can export, import, or permanently delete all their data at any time.

## License

MIT
