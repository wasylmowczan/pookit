# Pookit

Pookit is a modern SaaS template/boilerplate built with SvelteKit, Pocketbase and shadcn-svelte. Includes auth, user & admin dashboard, user settings, and more.

## 🏗 Project Structure

- `src/web`: SvelteKit frontend
- `src/backend`: PocketBase backend

## ⭐️ Features

- SvelteKit frontend with TailwindCSS
- PocketBase backend with SQLite
- Authentication system
- Super admin dashboard
- Billing system
- Email support
- Mobile optimized

## 🚀 Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/wasylmowczan/pookit.git
   cd pookit
   ```

2. Set up environment:

   ```bash
   # Create .env in src/web
   PUBLIC_BASE_URL=http://localhost:5173
   PUBLIC_PB_URL=http://127.0.0.1:8090
   ```

3. Start backend:

   ```bash
   cd backend
   ./pocketbase serve
   ```

4. Start frontend:

   ```bash
   cd web
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`

## 🌐 Deployment

### Backend: PocketHost

1. Sign up on [PocketHost](https://pockethost.io).
2. Create new instance and connect GitHub repository.
3. Note your Public URL (e.g., `https://your-instance.pockethost.io`)

### Frontend: Cloudflare Pages

1. Log in to [Cloudflare Pages](https://pages.cloudflare.com).
2. Connect your GitHub repository.
3. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Root directory: `web`
4. Add environment variables:

   ```
   PUBLIC_BASE_URL=https://pookit.dev/ // Cloudflare Pages URL
   PUBLIC_PB_URL=https://your-instance.pockethost.io // PB URL, dodaç w Cloudflare
   PUBLIC_BASE_URL=https://pookit.dev/ // Cloudflare Pages URL
   PUBLIC_PB_URL=https://your-instance.pockethost.io // URL of your PocketBase instance
   PRIVATE_PB_ADMIN_EMAIL=email@example.com
   PRIVATE_PB_ADMIN_PASSWORD=********
   PRIVATE_POSTHOG_PROJECT_API_KEY=phc_xxxx
   PRIVATE_POSTHOG_API_HOST=https://eu.i.posthog.com
   PRIVATE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   PRIVATE_GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   RESEND_FROM_ADDRESS=Pookit.dev <hello@yourdomain.com>
   RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
   POLAR_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxx
   POLAR_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
   POLAR_SERVER=sandbox
   ```

5. Add Compatibility flag `nodejs_compat_v2`

## 🔧 Configuration

### PocketBase

- Admin panel: `http://localhost:8090/_/`
- Uses `pb_migrations` for schema
- Uses `pb_hooks` for custom logic
- Data in `pocketbase_data` volume

### Frontend

- Components in `src/web/src`
- Uses shadcn-svelte components
- Tailwind for styling
- Superforms for form handling

## 💖 Contributing

Issues and PRs welcome!
