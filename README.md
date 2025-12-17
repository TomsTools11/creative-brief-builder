## README — Creative Brief Builder

A lightweight web app for generating and assembling a polished creative brief (built to run locally and deploy easily). It’s structured like an “AI Studio app” project and includes everything needed to run it on your machine. [^1]

---

## Tech Stack

* TypeScript + React (Vite-style layout implied by repo files like `vite.config.ts`, `index.tsx`, `App.tsx`) [^1]
* Netlify deployment support (`netlify/`, `netlify.toml`) [^1]

---

## Project Structure (high level)

* `components/` — UI components [^1]
* `services/` — service layer (API / integrations) [^1]
* `netlify/` + `netlify.toml` — Netlify functions/config [^1]
* `types.ts`, `constants.ts` — shared types/constants [^1]
* Design assets and examples:
    * `brief-builder-style-guide.pdf` [^1]
    * `creative-brief (2).pdf` [^1]
    * `landing-page.png`, `overivew-page.png`, `analysis-in-progress-screen.png` [^1]

---

## Prerequisites

* Node.js (required to run locally) [^1]

---

## Run Locally

1. Clone:
    ```bash
    git clone https://github.com/TomsTools11/creative-brief-builder.git
    cd creative-brief-builder
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment:
    * Create `.env.local` in the project root (the repo references `.env.local`) [^1]
4. Start dev server:
    ```bash
    npm run dev
    ```

---

## Deploy (Netlify)

This repo includes Netlify configuration and a `netlify/` directory, so it’s set up for Netlify deploys. Typical flow:

* Connect the GitHub repo to Netlify
* Ensure build command/output align with your Vite setup
* Add any required environment variables in Netlify project settings [^1]

---

## Screenshots / Design References

* `landing-page.png` — landing page mock/screenshot [^1]
* `overivew-page.png` — overview page (file name as in repo) [^1]
* `analysis-in-progress-screen.png` — analysis/in-progress state [^1]
* `brief-builder-style-guide.pdf` — style guide [^1]
* `creative-brief (2).pdf` — example output brief [^1]

