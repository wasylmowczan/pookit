# Svelte.rocks

SvelteKit SaaS starter kit.

## 🏗 Project Structure

- `src/web`: SvelteKit frontend
- `src/backend`: PocketBase backend

## ⭐️ Features

- SvelteKit frontend with TailwindCSS
- PocketBase backend with SQLite
- Authentication system
- Dark/Light mode
- Mobile optimized

## 🚀 Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/wasylmowczan/svelte.rocks.git
   cd svelte.rocks
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

1. Sign up on [PocketHost](https://pockethost.io)
2. Create new instance and connect GitHub repo
3. Set environment variables in PocketHost dashboard
4. Note your Public URL (e.g., `https://your-instance.pockethost.io`)

### Frontend: Cloudflare Pages

1. Log in to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Root directory: `web`
4. Add environment variables:

   ```
   PUBLIC_BASE_URL=https://svelte-rocks.pages.dev/ // Cloudflare Pages URL
   PUBLIC_PB_URL=https://your-instance.pockethost.io // PB URL, dodaç w Cloudflare
   ```

5. Add Compatibility flag `nodejs_compat`

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
