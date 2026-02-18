# OCM Tennis - Club Championship Management

> **⚠️ Portfolio Project** - This code is available for viewing purposes only. See [LICENSE](LICENSE) for details.

A modern web application for managing and displaying tennis club championship data, built with Next.js and integrated with the French Tennis Federation (FFT) API.

## 📋 Overview

This application provides a comprehensive dashboard for tennis club championship management, featuring:

- **Real-time championship data** - Automated sync with FFT TenUp API
- **Team rankings & statistics** - Track performance across multiple categories
- **Match results tracking** - Historical and current match data
- **Automated reporting** - Weekly email summaries with visual results
- **Interactive UI** - Modern design with animations and responsive layouts

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Motion animations
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Resend with React Email templates
- **PDF Generation**: Puppeteer for match result images
- **Deployment**: Vercel with cron jobs

## ✨ Key Features

### Dashboard
- Overview statistics (teams, matches, victories)
- Filterable team tables with ranking data
- Category-based organization (Seniors, Youth)

### Championship Tracking
- Multiple pool and division support
- Real-time match scores and schedules
- Team performance metrics

### Automated Tasks
- Daily data synchronization via cron jobs
- Weekly email reports with match results
- Automatic image generation for social sharing

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.x
postgresql >= 14.x
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/paulCoulombel/ocmTennis.git
cd ocmTennis
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database
```bash
# Start PostgreSQL (using Docker)
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses a relational database with the following main models:

- **Pool** - Championship pools/groups
- **Team** - Teams participating in championships
- **Match** - Individual matches with scores
- **Url** - FFT API endpoints for data sync

## 📧 Email System

Weekly automated emails include:
- Match results summary
- Generated result images
- Responsive HTML templates using React Email

## 🔒 Security

- Environment-based configuration
- Cron job authentication with secret tokens
- No hardcoded credentials

## 📦 Project Structure

```
app/              # Next.js app directory
├── api/          # API routes and cron jobs
├── contact/      # Contact page
├── policyPages/  # Legal pages
└── teamChampionship/ # Championship views

components/       # React components
├── custom/       # Custom UI components
├── tables/       # Data table components
└── ui/           # Reusable UI elements

server/           # tRPC server
├── routers/      # API route handlers
└── trpc.ts       # tRPC configuration

prisma/           # Database
├── schema.prisma # Database schema
└── migrations/   # Migration files

lib/              # Utilities
├── mail.ts       # Email service
└── prisma.ts     # Prisma client
```

## 🛠️ Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking
```

## 📄 License

Copyright (c) 2025-2026 Paul Coulombel. All Rights Reserved.

This code is available for viewing purposes only. See [LICENSE](LICENSE) for more information.

## 👤 Author

**Paul Coulombel**
- GitHub: [@paulCoulombel](https://github.com/paulCoulombel)
