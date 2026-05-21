# ⚡ Kanban Flow

A premium, portfolio-grade responsive Kanban board built with **Vanilla JavaScript**, **Tailwind CSS v4**, and **Vite**. Engineered with fluid animations, intuitive HTML5 drag-and-drop workflow, status-specific colored highlights, and a persistent multi-theme dashboard ideal for developer team organization.

## ✨ Key Features

- **Intuitive Drag-and-Drop**: Built using native HTML5 drag-and-drop APIs with immediate layout updates and active drag-state highlights.
- **Dynamic Theme Toggler**: Toggle between sleek dark theme and crisp light theme seamlessly, backed by persistent browser memory and instant inline CSS variables to prevent theme flashes on page load.
- **Visual Task Indicators**: Task cards are categorized by category tags and priorities (Low, Medium, High) with colored indicators and glow styling (Indigo for To Do, Amber for In Progress, Emerald for Done).
- **Responsive Layout**: Designed to adapt to all screen sizes. Uses a viewport-locked grid with independent column scrolling on desktops, and transforms to a stacking column list on mobile.
- **Live Local Storage Persistence**: State changes (including task creation, deletion, or column swaps) are automatically synchronized in `localStorage` under a versioned namespace.
- **Production Build Ready**: Fully optimized production bundle built with Vite and Tailwind v4.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript (ES6 Modules) & HTML5
- **Styling**: Tailwind CSS v4 (CSS-first engine) & Custom Vanilla CSS
- **Tooling & Bundler**: Vite 5
- **Icons**: Hand-crafted custom inline SVGs

## 📁 Directory Structure

```text
Kanban_JS/
├── dist/                # Optimized production assets (generated)
├── node_modules/        # Project dependencies
├── index.html           # Main application interface markup
├── app.js               # Application state, event handlers, and render engine
├── style.css            # Tailwind directives, theme definitions, and scrollbars
├── vite.config.js       # Vite bundler configuration
├── package.json         # Package dependencies and scripts
└── README.md            # Project documentation (this file)
```

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ is recommended).

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

To boot up the Vite local development server:
```bash
npm run dev
```
Open **[http://localhost:5174](http://localhost:5174)** (or the port outputted in your terminal) in your browser.

### Building for Production

To compile and bundle assets into an optimized, self-contained `dist/` build folder:
```bash
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```
