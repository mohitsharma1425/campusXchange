# campusXchange
CampusXchange is a MERN stack web application that allows students to buy, sell, and exchange products within their campus through secure authentication, real-time messaging, and smart listing management.

## Deploying on Vercel

This repository contains a Vite frontend and an Express/Socket.IO backend. Deploy the frontend on Vercel, and deploy the backend on a Node host that supports long-running servers and WebSockets, such as Render, Railway, Fly.io, or a VPS.

### Vercel frontend settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: project root

Add these Vercel environment variables after your backend is deployed:

```env
VITE_API_BASE_URL=https://your-backend-url.example.com/api
VITE_SOCKET_URL=https://your-backend-url.example.com
```

### Backend environment variables

Set these on your backend host:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/campusxchange
JWT_SECRET=change-this-to-a-long-random-secret
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
PORT=4000
```

Vercel should not receive `MONGODB_URI` or `JWT_SECRET` for this frontend-only deployment.
