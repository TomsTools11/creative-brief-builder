# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server on port 3000
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` for the Gemini API. The vite config exposes it as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.

## Architecture

**VisualBrief AI** is a React app that generates creative briefs from uploaded marketing images using Google's Gemini 2.5 Flash model.

### Application Flow

1. **Upload** (`UploadZone.tsx`) - Users upload up to 3 images (max 5MB each, resized to 1024px max dimension)
2. **Analysis** (`geminiService.ts`) - Images sent to Gemini with a structured JSON schema for the response
3. **Results** (`BriefResult.tsx`) - Displays the creative brief with PDF export via jsPDF

### Key Files

- `App.tsx` - Main component managing state machine (`upload` → `analyzing` → `results`)
- `types.ts` - TypeScript interfaces for `CreativeBrief` structure (visual style, brand voice, messaging, audience, recommendations)
- `services/geminiService.ts` - Gemini API integration with response schema
- `services/imageUtils.ts` - Image resizing/compression utilities (converts all images to JPEG at 85% quality)
- `constants.ts` - Limits (MAX_IMAGES=3, MAX_FILE_SIZE=5MB, MAX_IMAGE_DIMENSION=1024)

### Path Alias

`@/` resolves to project root (configured in both vite.config.ts and tsconfig.json).
