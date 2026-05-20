# Scervy Peak — Product Roadmap

## Vision
Build Africa's dominant AI-native real estate operating system — an intelligent, trusted, and scalable property platform combining AI-powered intelligence, mobile-first architecture, trust-first transactions, and hyperlocal neighborhood data.

---

## Current State (May 2026)

### ✅ What's Live
- Frontend: https://web-ffulrcu5y-baahe.vercel.app (Vercel)
- Backend: https://african-realestate-platform.onrender.com (Render, cold-starting)
- Auth: JWT-based login/register with owner role
- Property listings CRUD for owners
- Agent directory + neighborhood pages
- Image upload via Cloudinary
- Sitemap, robots.txt, SEO foundations

### ⚠️ What's In Flight
- MongoDB Atlas connection being configured (MONGODB_URI env var needed)
- JSON-LD schema + Open Graph tags on property detail pages
- Frontend enhancements (trust badges, neighborhood intelligence display)
- Footer component

### ❌ What's Missing / Blocked
- Real backend data (no live MongoDB Atlas M0 URI set in Render)
- Property detail: schema.org markup, Open Graph, Twitter cards
- Blog/content feed (PRD section 7.1)
- Agent verification + trust badges (PRD section 7.5)
- AI recommendation engine (PRD section 7.7)
- Semantic search (PRD section 7.2)
- Escrow system (PRD section 7.8)
- WhatsApp automation (PRD section 7.9)

---

## 🚀 Stage 1 — Curated Owner Listings

**Timeline:** NOW → June 2026
**Goal:** Launch premium owner-only listing platform, build SEO authority in Ghana, validate inquiry flows

### Features

#### Core UX
- [x] Premium UI with design system (forest green + gold on cream)
- [x] Owner registration + role system
- [x] Property listing form with image upload
- [x] Owner dashboard (manage listings, view performance)
- [x] Property search with basic filters
- [x] Property detail page
- [x] Login / Register pages
- [ ] "Remember me" on login
- [ ] Property detail: JSON-LD schema.org markup ← IN PROGRESS
- [ ] Property detail: Open Graph + Twitter cards ← IN PROGRESS
- [ ] Property detail: trust badges (verified, owner-listed, view count) ← IN PROGRESS

#### Pages
- [x] Homepage
- [x] /properties — search + grid
- [x] /properties/[id] — detail
- [x] /agents — directory
- [x] /neighborhoods — index + detail
- [x] /owner/listings — dashboard
- [x] /sell — listing CTA page
- [x] /about — company page
- [x] /login + /register
- [x] /sitemap.xml
- [x] /robots.txt
- [ ] Blog (PRD section 7.1) ← P2

#### SEO & Performance
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Design system CSS variables
- [x] Tailwind + Framer Motion
- [x] Lighthouse 95+ target ← NEEDS TESTING
- [ ] PWA support (PRD section 12) ← P2

#### WhatsApp Integration
- [ ] wa.me CTA buttons on property pages ← IN PROGRESS
- [ ] WhatsApp inquiry auto-reply ← P2

### Metrics Target (Stage 1)
| Metric | Target |
|--------|--------|
| Listings | 100+ |
| Monthly Active Users | 5,000+ |
| Inquiry Conversion | 3%+ |
| Lighthouse (Mobile) | 95+ |
| SEO Traffic (Ghana) | Top 10 for "property Ghana" |

---

## 🚀 Stage 2 — AI-Powered Intelligence

**Timeline:** Q3 2026
**Goal:** Agent onboarding, AI property intelligence, neighborhood scoring

### Features
- [ ] AI recommendation engine (personalized listings)
- [ ] Semantic search (NLP queries)
- [ ] Investment intelligence (ROI, rental yield, appreciation)
- [ ] Agent onboarding + verification + trust badges
- [ ] Fraud detection layer
- [ ] Neighborhood intelligence scores (safety, walkability, investment)
- [ ] AI-generated property summaries

### Tech Additions
- [ ] Vector database (embeddings)
- [ ] Mapbox integration
- [ ] Sentry + PostHog

---

## 🚀 Stage 3 — Trusted Marketplace

**Timeline:** Q4 2026
**Goal:** Become trusted marketplace with escrow, subscriptions

### Features
- [ ] Escrow infrastructure (deposit + tracking)
- [ ] Transaction state machine (pending/funded/inspection/dispute/released/refunded)
- [ ] Review + rating system
- [ ] Subscription plans (owner/agent tiers)
- [ ] Featured/boosted listings
- [ ] Payment integration (MoMo + card via Paystack)

---

## 🚀 Stage 4 — Africa-Wide Infrastructure

**Timeline:** 2027
**Goal:** Pan-Africa expansion, enterprise API, mobile app

### Features
- [ ] Multi-country expansion (Nigeria, Kenya, SA, UK)
- [ ] Enterprise REST API
- [ ] White-label partnerships
- [ ] iOS + Android mobile app
- [ ] Mortgage partnership integration
- [ ] Insurance partnership integration

---

## Success Metrics (All Stages)

| Metric | Stage 1 | Stage 2 | Stage 3 | Stage 4 |
|--------|---------|---------|---------|---------|
| Listings | 100 | 1,000 | 10,000 | 50,000+ |
| Monthly Users | 5,000 | 50,000 | 200,000 | 1M+ |
| Inquiry Conv. | 3% | 5% | 8% | 10% |
| Revenue | $0 | $5K/mo | $50K/mo | $500K/mo |