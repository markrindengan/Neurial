

# Neurial — High-End Web Agency Landing Page

## Design System
- **Theme**: Tactile Maximalism with "Nature Distilled" base (warm greys, cloud dancer white, earthy neutrals) + "Cyber Neon" electric accents (vivid cyan/lime/magenta)
- **Layout**: Bento Grid 2.0 with rounded cards, dotted-line separators, and crisp grid borders
- **Interactions**: "Squishy UI" buttons with scale/bounce animations on click, smooth hover states throughout

---

## Pages & Sections

### 1. Hero Section (Scrollytelling)
- Full-viewport immersive hero with an **animated Three.js 3D abstract scene** (floating geometric shapes with neon glow)
- Headline text that morphs/liquifies as the user scrolls down (CSS clip-path + scroll-based transforms)
- Lazy-loaded 3D canvas with a loading skeleton for performance
- Clear CTA button ("Start Your Project") with squishy bounce effect

### 2. Services Section (Bento Grid)
- Modular bento-style grid with 3 primary service cards:
  - **AI Automation** — intelligent workflows & chatbots
  - **Hyper-Local E-Commerce** — location-aware storefronts
  - **EdTech Builds** — learning platforms & course tools
- Each card has an icon, brief description, and hover animation
- Dotted borders between cards for visual separation

### 3. About / Why Neurial
- Brief agency story with bold typography
- Key stats or differentiators in small bento tiles (projects delivered, technologies, client satisfaction)

### 4. Lead Capture Form
- Detailed contact form: name, email, phone, company, budget range (dropdown), project type (dropdown), message
- Form validation with clear error states
- Submissions stored in Supabase `contact_submissions` table
- Success confirmation with animated feedback

### 5. Footer
- Social links, quick navigation, copyright
- Consistent neon accent styling

---

## Authentication & Admin

### Public Auth (Client Portal)
- Sign up / Log in pages with email + password via Supabase Auth
- User profiles table with basic info (name, avatar)
- Password reset flow with dedicated `/reset-password` page

### Admin Dashboard
- Protected `/admin` route accessible only to users with `admin` role
- View and manage contact form submissions (table view with status filters)
- User roles stored in a separate `user_roles` table with RLS policies and a `has_role()` security definer function

---

## Backend (Supabase)

### Database Tables
- `profiles` — user profile data linked to `auth.users`
- `user_roles` — role assignments (admin, user) with enum type
- `contact_submissions` — form entries (name, email, phone, company, budget, project_type, message, status, created_at)

### Security
- RLS enabled on all tables
- Users can only read/update their own profiles
- Only admins can view/manage contact submissions
- `has_role()` security definer function to prevent RLS recursion

---

## Performance & Accessibility
- Three.js canvas lazy-loaded with React Suspense
- All images and heavy assets use lazy loading
- High contrast color palette meeting WCAG AA
- Logical heading hierarchy and semantic HTML
- Full keyboard navigation support
- Focus-visible styles on all interactive elements

