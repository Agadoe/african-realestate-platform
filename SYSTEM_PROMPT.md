# SYSTEM_PROMPT.md

You are building an enterprise-grade African proptech platform called **Scervy Peak** — Africa's Intelligent Property Infrastructure.

## Brand Identity
- **Brand Name:** Scervy Peak | Tagline: "Elevate Your Property Journey"
- **Aesthetic:** Premium African — forest green (#1B4332) + warm gold (#C8A96E) on cream (#FEFDFB)
- **Voice:** Confident, warm, precise. No filler copy. Every word earns its place.
- **Niche:** Manifestation, law of attraction, personal growth, mindset (Mindscapes YouTube channel)

## Platform Requirements
- Mobile-first architecture
- Luxury-level UI (cinematic layouts, glassmorphism accents, smooth animations)
- SEO-first engineering (server-side rendering, schema.org, programmatic pages)
- AI-native systems (semantic search, recommendations, investment intelligence)
- Reusable components (atomic design)
- Production-grade code (TypeScript strict, modular)
- High trust UX (verification badges, review systems, escrow)
- Low-bandwidth optimization (progressive loading, adaptive images, offline-first)
- Enterprise scalability (monorepo, Docker, GitHub Actions)

## Design System
- **Colors:** Forest Green (#1B4332), Gold (#C8A96E), Cream (#FEFDFB)
- **Fonts:** Playfair Display (headings), Plus Jakarta Sans (body), DM Mono (prices)
- **Motion:** Framer Motion — smooth transitions, skeleton loaders, staggered reveals
- **Icons:** Lucide React (consistent stroke-based icons)

## Tech Stack (Current)
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand
- Backend: Express.js, MongoDB/Mongoose, JWT, bcrypt
- Media: Cloudinary
- Maps: Mapbox / Google Maps
- Deploy: Vercel (frontend), Render (backend)

## Must Outperform
- Foxtons (premium branding, local market dominance)
- Zillow (search infrastructure, property intelligence)
- Property24 (African presence, listing scale)

## Priorities
1. UX quality — feel premium, feel trustworthy
2. Speed — Lighthouse 95+, FCP <1.5s, TTI <3s
3. SEO — dominate Ghana property SEO
4. Conversion optimization — every page earns the next click
5. Trust systems — verification badges, escrow, reviews
6. Scalability — enterprise architecture, not a prototype
7. Maintainability — clean code, atomic components

## PRD Reference
- Full spec: `MASTER_PRD.md` in project root
- Current stage: `ROADMAP.md` — Stage 1 (Curated Owner Listings)

## Code Standards
- TypeScript only (strict mode)
- Atomic component design
- CSS variables for design tokens (never hardcode colors)
- `console.error` allowed in production; `console.log` stripped
- Mobile-first breakpoints: sm:640px md:768px lg:1024px xl:1280px

## Working Style
- Follow the PRD for feature requirements
- Match existing design system (forest green + gold + cream palette)
- Run `npm run build` after every file change; fix errors before moving on
- Use Next.js Image component for all images (optimization + lazy loading)
- Use Framer Motion for all page transitions and reveal animations
- Never use arbitrary Tailwind colors — use CSS variables or Tailwind's extended palette