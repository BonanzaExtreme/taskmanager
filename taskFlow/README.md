# TaskFlow

TaskFlow is a web-based task management system with authentication, dashboard views, task listing, and user settings.

## Run Locally (After Forking on GitHub)

1. Fork this repository on GitHub.
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/taskFlow.git
cd taskFlow
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:

```bash
npm run dev
```

6. Open the local URL shown in terminal (usually `http://localhost:5173`).

Optional checks:

```bash
npm run lint
npm run build
```

## Language Used

- JavaScript (ES Modules)
- CSS
- JSX (React components)

## System Description

TaskFlow is built as a single-page application using React and Vite. It includes:

- User authentication with Supabase Auth (sign up, sign in, sign out)
- Protected routes for authenticated pages
- Profile synchronization into a `profiles` table
- Task retrieval through a dedicated API layer (`src/api`)
- Dashboard, Tasks, and Settings modules with a shared main layout
- Theme toggle support (light/dark)

## Tech Stack

- React 19
- React Router
- Supabase JS SDK
- Vite
- ESLint

## Project Structure

```text
src/
	api/            # Session, profile, and task API wrappers
	components/     # Reusable UI components (Topbar, Sidebar, profile menu, etc.)
	context/        # Auth and theme context providers
	layouts/        # App layout wrappers
	modules/        # Feature modules: auth, dashboard, tasks, settings
	routes/         # Route guards (ProtectedRoute)
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Dependencies

Runtime dependencies:

- `@emotion/styled`
- `@mui/material`
- `@mui/x-charts`
- `@supabase/supabase-js`
- `react`
- `react-dom`
- `react-icons`
- `react-router-dom`

Dev dependencies:

- `vite`
- `@vitejs/plugin-react`
- `eslint`
- `@eslint/js`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run lint checks

## Notes

- Route access is session-aware. Authenticated users are redirected to `/dashboard`.
- For Supabase table security, use RLS policies (recommended) for `profiles` and `tasks`.
