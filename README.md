## 📁 Backend - Imopeksis API

### 🌍 Project Overview
This is the **backend** service for the Imopeksis platform. It serves static article content, audio files, and metadata via a simple **Node.js + Express** API.

---

### 🧰 Tech Stack
- Node.js
- Express
- TypeScript
- Render.com (Hosting)
- JSON-based mock database

---

### 🚀 Getting Started

#### 📦 Install dependencies
```bash
npm install
```

#### 🔧 Start development server
```bash
npm run dev
```

#### 🏗 Build project (optional if using ts-node)
```bash
npm run build
```

---

### 🗂 Directory Structure
- `routes/`: API route handlers
- `public/`: Static audio files
- `data/`: JSON files with article content and metadata

---

### 🔐 Environment
No authentication is required for this public API. CORS is enabled for safe cross-origin frontend access.

---

### 🌐 Deployment
Hosted on **Render.com** as a Web Service.

#### Required settings:
- Build command: `npm run build`
- Start command: `npm run start`
- Root directory: `/`

---

### 🔌 Endpoints Overview
- `GET /articles`: Return list of all articles
- `GET /articles/:slug`: Return metadata + content of single article
- `GET /articles/:slug/audio`: Stream corresponding audio file

---

### 🎯 Notes
Make sure uploaded `.mp3` files and `.json` content stay in sync with frontend references for accessibility.
