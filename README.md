# 🐝 Help Hive

[![React Version](https://img.shields.io/badge/react-19.x-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Capacitor Android](https://img.shields.io/badge/capacitor-android_6.2-green?logo=capacitor)](https://capacitorjs.com/)
[![Supabase](https://img.shields.io/badge/supabase-2.110-emerald?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Help Hive** is a digital neighborhood support network connecting senior citizens with nearby volunteers. Unlike typical gig-economy applications, Help Hive is designed from the ground up as a trust-first, calm, and highly accessible community space. 

It eliminates tech-anxiety for older adults while providing explicit, step-by-step guidance and safety assurances for local volunteers.

---

## 📲 Download & Try It

> **[⬇️ Download HelpHive.apk](./HelpHive.apk)** (4.3 MB — Android 8.0+)
>
> Tap the link above to download the APK directly from this repository. On your Android phone, open the file and allow installation from unknown sources when prompted.

---

## 🌟 Key Features

*   🗣️ **Voice-First Request Wizard**: Includes native Web Speech API dictation, allowing seniors with visual or motor impairments to input requests by speaking.
*   🗺️ **Geospatial Discovery**: A dual List and Map layout (powered by Leaflet) that displays open requests nearby, complete with distance indicators and visual urgency tracking.
*   ⚠️ **Emergency Guardrails**: Smart, calm warnings triggered by high-priority selections (like "Right now" urgency) to direct users to emergency services (112) when needed.
*   ♿ **AAA Accessibility & Motion Controls**: Minimum 48px touch targets, base 18px readable text sizes, and global `prefers-reduced-motion` config via Framer Motion to prevent vestibular discomfort.
*   🔒 **Trust-Focused Onboarding**: Verification badge integration, detailed bios, and safety check screens before volunteers accept requests.

---

## 📁 Repository Directory Layout

The codebase follows a modular, feature-based architecture separating domain logic from global layout providers:

```text
help-hive/
├── .agents/               # Custom guidelines and safety rules for AI pair-programmers
├── android/               # Native Android Studio project wrapped by Capacitor
├── docs/                  # In-depth design systems and architectural files
├── public/                # Static assets, svg maps, and vector icon sheets
├── src/
│   ├── app/               # Root routing, route guards, and app-level wrappers
│   ├── components/        # Reusable base components (bottom navigation, global layouts)
│   ├── contexts/          # State providers for hybrid Auth and Requests caching
│   ├── features/          # Domain-specific modules:
│   │   ├── auth/          # Login, Registration, and Role selection screens
│   │   ├── onboarding/    # Interactive onboarding walkthroughs for new users
│   │   ├── requester/     # Senior dashboard, New Request wizard, and detailed tracking
│   │   └── volunteer/     # Helper dashboard, Leaflet discover map, and request details
│   ├── hooks/             # Shared hooks (e.g. useProfile, useRole)
│   ├── lib/               # Tailwind utilities and CN classes resolvers
│   ├── services/          # API layers interfacing with local Storage or Supabase
│   ├── types/             # Common TypeScript schema types and database interfaces
│   └── utils/             # Dark mode utilities, form validations, and database seeds
├── supabase/              # Database schemas, migrations, and access policies (RLS)
├── capacitor.config.ts    # Native mobile wrapper configuration
├── package.json           # App dependencies and lifecycle scripts
└── tsconfig.json          # TypeScript build and module resolution configuration
```

---

## 🛠️ Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the repository
```bash
git clone https://github.com/jvstin47/Help-hive.git
cd Help-hive
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables (Optional)
Help Hive runs in a fully offline/prototype mode by default if no Supabase environment variables are specified. To connect to a live backend, create a `.env.local` file in the root:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anonymous-key
```

### 4. Run the Development Server
To launch the web interface with Hot Module Replacement (HMR):
```bash
npm run dev
```

### 5. Build for Production
To typecheck and bundle the project files for web output:
```bash
npm run build
```

---

## ⚙️ Architectural State Boundaries

Help Hive separates server synchronization from local UI state:
- **Server State (TanStack Query)**: Owns profiles and request lists. Cached server data is fetched and updated via query/mutation hooks.
- **Client State (React Context)**: Owns transient client properties, including the active authentication session (`AuthContext`), theme configurations, and wizard form state.

For details, read the [Architecture Documentation](ARCHITECTURE.md) and [Design System Guidelines](DESIGN_SYSTEM.md).
