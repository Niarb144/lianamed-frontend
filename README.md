# Medical Frontend (React + TypeScript)

This is a starter frontend for the LianaMed backend.

## Setup

1. Install deps

```bash
npm install
```

2. Create `.env` (optional) or set VITE_API_BASE in environment

```env
VITE_API_BASE=http://localhost:5000/api
```

3. Run dev server

```bash
npm run dev
```

## Notes
- If your backend runs on another machine, change VITE_API_BASE accordingly.
- The Products page uses a fallback static list if the `/products` endpoint is not present.
