After the factory finishes building an agent, output the exact terminal commands and dashboard steps to have the new agent live in production within 5 minutes.

**Standard Deploy Sequence:**

1. **Tavus Dashboard** (manual — 2 min)
   - Create persona with provided system prompt
   - Add all LLM tools (paste JSON one at a time)
   - Add visual + audio perception tools
   - Set visual/audio tool prompts
   - Set perception queries (visual awareness, audio awareness, analysis)
   - Set callback URL: `https://voxaris-orchestrator.vercel.app/api/execute`
   - Copy persona ID → update .env.local

2. **Terminal Commands** (automated — 3 min)
   ```bash
   # Update persona ID
   cd ~/voxaris-site/orchestrator
   echo "TAVUS_PERSONA_ID=<new_persona_id>" >> .env.local

   # If new tools were added to orchestrator:
   npm run build
   git add -A && git commit -m "feat: add <vertical> agent tools"
   git push origin main
   # Vercel auto-deploys from GitHub

   # If DB changes needed:
   npm run db:push
   npx tsx scripts/seed-demo.ts
   ```

3. **Vercel Dashboard** (if env vars changed)
   - Go to: https://vercel.com/ethan-stopperich-s-projects/voxaris-orchestrator/settings/environment-variables
   - Update TAVUS_PERSONA_ID
   - Trigger redeploy

4. **Test** (30 seconds)
   ```bash
   # Create test conversation
   TAVUS_PERSONA_ID=<id> npx tsx scripts/create-conversation.ts
   # Open the conversation URL in browser
   ```

5. **Embed on client site**
   ```html
   <script src="https://voxaris-orchestrator.vercel.app/voxaris-loader.js"
           data-persona-id="<persona_id>"
           data-mode="self-demo"
           async></script>
   ```

**Vercel Project Details:**
- Project: `prj_8feiiCEX9qudoqYtzoGoOlMbHSxK`
- Team: `team_qg96of57kJvRgm9pTh8wpDor`
- URL: `voxaris-orchestrator.vercel.app`
- GitHub: `ethanstopperich1-rgb/voxaris` (root: `orchestrator/`)
