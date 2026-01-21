# V-Suite SaaS (Monorepo)

This repository contains two distinct parts:

1.  **Frontend (`/`)**: The Lovable/Vite React Application (Dashboard).
2.  **Backend (`/server`)**: The Express/Node.js API (AI Logic).

## 🚀 How to Install & Run

### 1. Frontend (The Dashboard)

This runs the UI in your browser.

```bash
# In the root 'voxaris-ai-connect' folder
npm install
npm run dev
```

- **Access:** `http://localhost:8080` (Check terminal for port).
- **New Feature:** Go to `/dashboard/hiring-hall` to see the Agent Showcase.

### 2. Backend (The Server)

This runs the Voice/Video API and Webhooks.

```bash
# Open a NEW terminal window
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```

- **Access:** `http://localhost:3000`

---

## 📂 Project Structure

- `src/components/dashboard` -> Contains the new `AgentShowcase`.
- `server/src/modules/` -> Will contain the Voice (Retell) and Video (Tavus) logic.
- `server/src/config/unifiedConfig.ts` -> Environment configuration.

## 🔑 Environment Variables

Make sure to create `.env` files in both root and `server/` if needed, following `.env.example`.
