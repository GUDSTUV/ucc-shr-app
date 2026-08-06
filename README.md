# CEGRAD UCC — Sexual Harassment Reporting Platform

A web platform for reporting and managing sexual harassment cases at the University of Cape Coast (UCC), operated by the Centre for Gender Research, Advocacy & Documentation (CEGRAD).

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via [Neon](https://neon.tech/) + Prisma ORM
- **Auth:** NextAuth.js v5 (credentials, email verification, password reset)
- **Email:** [Brevo](https://www.brevo.com/) Transactional API
- **Storage:** Cloudinary
- **Push Notifications:** Web Push (VAPID)

---

## Getting Started

### Prerequisites

- Node.js `>= 20`
- npm `>= 10`
- A PostgreSQL database (e.g. Neon)
- Cloudinary and Brevo accounts

### Installation

```bash
git clone <repository-url>
cd ucc-shr
npm install          # also runs prisma generate
cp .env .env.local   # fill in your credentials
npx prisma db push   # apply schema to your database
npm run seed:admin   # create the first SUPER_ADMIN account
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Brevo (email)
BREVO_API_KEY="xkeysib-..."
EMAIL_FROM_NAME="CEGRAD UCC"
EMAIL_FROM_ADDRESS="noreply@yourdomain.com"

# Web Push — generate with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."

# Seed script
SEED_ADMIN_EMAIL="admin@ucc.edu.gh"
SEED_ADMIN_PASSWORD="..."
SEED_ADMIN_NAME="Super Admin"
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run dev:turbo` | Start with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed:admin` | Seed the initial SUPER_ADMIN account |

---

## User Roles

| Role | Description |
|---|---|
| `SUPER_ADMIN` | Full access — team management, analytics, site content, case assignment |
| `Case officer` | View and manage only cases assigned to them |
| `Reporter` | Submit reports, view their own cases dashboard, RSVP to events |

---

## Deployment

Deploy on [Vercel](https://vercel.com/). Set all environment variables in the Vercel project settings before deploying.

> Ensure your PostgreSQL provider allows connections from Vercel, or enable connection pooling via `@prisma/adapter-pg`.

---

<div align="center">
  <sub>Built for CEGRAD — University of Cape Coast</sub>
</div>

