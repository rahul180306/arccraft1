# 🧠 ArcCraft — AI Studio Applet

> A full-stack AI-powered studio platform built with **Next.js 15**, **React 19**, and **Google Gemini** — featuring document editing, interactive maps, graph visualization, data analytics, and more.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Private-red)](#)

---

## 📌 Overview

**ArcCraft** is an intelligent studio applet that integrates cutting-edge AI capabilities with powerful data tools. Designed for analysts, investigators, and developers, it provides a unified workspace to explore datasets, visualize graphs, annotate documents, and interact with AI models — all within a modern web interface.

---

## ✨ Features

- 🤖 **AI Chat & Analysis** — Powered by Google Gemini (`@google/genai`) and OpenAI for intelligent document and data analysis
- 📄 **Document Editor** — Embedded OnlyOffice document editor with full collaborative editing support
- 🗺️ **Interactive Maps** — Leaflet + Google Maps integration for geospatial data visualization
- 🕸️ **Graph Visualization** — Cytoscape.js with Dagre and fCoSE layouts for network/relationship graph rendering
- 📊 **Data Charts** — Plotly.js powered interactive charts and dashboards
- 🔥 **Firebase Auth & Storage** — Secure authentication and cloud storage
- 🐘 **Neon Serverless DB** — PostgreSQL via Neon for scalable serverless data persistence
- 🎨 **Smooth Animations** — GSAP, Anime.js, Motion, and Lenis for fluid UI transitions
- 📦 **State Management** — Zustand for lightweight and scalable global state
- 🧩 **Component Library** — Lucide icons, CVA, and custom Tailwind components

---

## 🗂️ Project Structure

```
arccraft1/
├── app/                  # Next.js App Router (pages, layouts, routes)
├── backend/              # API routes, server-side logic
├── components/           # Reusable React UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared logic
├── stores/               # Zustand state stores
├── public/               # Static assets
├── extract_dataset.py    # Python script for dataset extraction
├── docker-compose.onlyoffice.yml  # OnlyOffice Docker setup
├── .env.example          # Environment variable template
└── package.json          # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18` or [Bun](https://bun.sh/)
- Docker (for OnlyOffice editor)
- A Firebase project
- A Neon database instance
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/rahul180306/arccraft1.git
cd arccraft1

# Install dependencies
npm install
# or
bun install
```

### Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

### OnlyOffice Setup (Document Editor)

```bash
docker-compose -f docker-compose.onlyoffice.yml up -d
```

---

## 🧪 Dataset Scripts

```bash
# Extract and process FIR dataset
python extract_dataset.py

# Extract headers from Excel/JSON
node extract_headers.js
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4, GSAP, Anime.js, Motion |
| AI/ML | Google Gemini, OpenAI API |
| Database | Neon (Serverless PostgreSQL) |
| Auth & Storage | Firebase 12 |
| Document Editor | OnlyOffice |
| Maps | Leaflet, React-Leaflet, Google Maps |
| Graphs | Cytoscape.js (Dagre, fCoSE) |
| Charts | Plotly.js |
| State | Zustand |
| Package Manager | Bun / npm |

---

## 📋 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean Next.js cache |

---

## 🤝 Contributing

This is a private project. For contributions or collaboration inquiries, please reach out to the repository owner.

---

## 📄 License

This project is private and proprietary. All rights reserved © 2026 Rahul.

---

<p align="center">Built with ❤️ using Next.js, Gemini AI, and modern web technologies</p>
