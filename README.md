# ⚡ Kanban Flow (Deployment link - kanbantaskt.netlify.app)

A premium, developer-focused responsive Kanban board built with **Vanilla JavaScript**, **Tailwind CSS (CDN)**, and a lightweight **static server**. Engineered with fluid animations, native HTML5 drag-and-drop workflow, and a persistent dark theme dashboard ideal for developer team task management.

## ✨ Key Features

- **Forced Dark Mode Theme**: Sleek, immersive developer dark theme enabled by default (no flash of light theme on load) to match modern IDE aesthetics.
- **Intuitive Drag-and-Drop**: Built using native HTML5 drag-and-drop APIs with immediate layout updates and active drag-state highlights.
- **Visual Task Indicators**: Task cards are categorized by custom labels (e.g. Backend, Frontend, Setup) and priority levels (Low, Medium, High) with colored indicators (Indigo for To Do, Amber for In Progress, Emerald for Done).
- **Responsive Layout**: Adapts smoothly to all screen sizes. Uses a viewport-locked grid with independent column scrolling on desktop screens, and transforms to a stacking column list on mobile.
- **Live Local Storage Persistence**: State changes (including task creation, deletion, or column swaps) are automatically synchronized in `localStorage` under a versioned namespace.
- **Ultra-Lightweight & Clean**: Simplified codebase by removing extra light-theme transitions, unused dependencies, and complex bundlers (Vite) for ease of explanation during developer internship interviews.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript (ES6 Modules) & HTML5
- **Styling**: Tailwind CSS (via CDN) & Custom Vanilla CSS variables
- **Tooling**: Built-in static serving via `http-server` (No complex build step or transpiler needed)
- **Icons**: Hand-crafted custom inline SVGs

## 📁 Directory Structure

```text
Kanban_JS/
├── index.html           # Main application interface markup & layout
├── app.js               # Application state, event handlers, and render engine
├── style.css            # Custom theme variables, styles, and scrollbars
├── package.json         # Scripts and server command definitions
└── README.md            # Project documentation (this file)
```

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Navigate to the project directory:
   ```bash
   cd Kanban_JS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the static local web server:
```bash
npm start
```
Open **[http://127.0.0.1:8080](http://127.0.0.1:8080)** in your browser to view the application.
