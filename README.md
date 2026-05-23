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
   cd ssskit.io
   ```

2. Set up environment:

   ```bash
   # Create .env in src/web
   PUBLIC_PB_URL=http://localhost:8090
   ORIGIN=http://localhost:5173
   ```

3. Start backend:

   ```bash
   cd src/backend
   ./pocketbase serve
   ```

4. Start frontend:

   ```bash
   cd src/web
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`

## 🌐 Deployment

### Using Coolify (Recommended)

1. Set up on Hetzner
2. Configure in Coolify:

   ```bash
   PUBLIC_PB_URL=https://api.your-domain.com
   ORIGIN=https://your-domain.com
   ```

3. Deploy via Coolify interface

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
