# DevPath Architecture Documentation

Welcome to the DevPath architecture documentation. This document outlines the system architecture, folder structures, component dependencies, and design patterns utilized in the DevPath India Community Platform.

---

## 🗺️ System Architecture Overview

DevPath is built on a modern, decoupled architecture:

1. **Frontend (Client-Side)**: A fast, responsive Next.js 16 (App Router) client deployed on Firebase Hosting.
2. **Backend (Server-Side)**: A lightweight Express.js server responsible for securely calling APIs (e.g., OpenRouter LLM APIs) and managing the floating assistant chat state.
3. **Database & Infrastructure Services**: Managed by Google Firebase (Authentication, Cloud Firestore, Hosting, and Security Rules).
4. **Third-Party Integrations**: GitHub API (for gamification sync) and OpenRouter (for AI-powered learner assistant).

### High-Level System Flow Diagram

```mermaid
graph TD
    %% Clients
    User([User Web Browser])

    %% Frontend Layer
    subgraph Frontend [Next.js App Client-Side]
        UI[Tailwind UI Components / Framer Motion / GSAP]
        Context[React Contexts: Auth, Gamification, RealTime, Notifications]
        Hooks[Custom Hooks & Libs: firebase.ts, github.ts]
    end

    %% Services / Backend Layer
    subgraph Services [DevPath Services]
        Hosting[Firebase Hosting]
        Auth[Firebase Authentication]
        Firestore[(Firestore Database)]

        subgraph Backend [Express Assistant Backend]
            Router[API Routes]
            Middleware[Rate Limiter & Validation]
            Controller[Controllers]
            Service[Services: OpenRouter & Conv Services]
        end
    end

    %% External APIs Layer
    subgraph External [External Integrations]
        OpenRouter[OpenRouter API LLMs]
        GithubAPI[GitHub GraphQL/REST API]
    end

    %% Connections
    User -->|Accesses Website| Hosting
    User -->|Interacts with UI| UI
    UI -->|Reads/Writes State| Context
    Context -->|Uses| Hooks

    %% Hooks / Firebase client communication
    Hooks -->|Session Token / Google OAuth| Auth
    Hooks -->|NoSQL Reads/Writes| Firestore
    Hooks -->|Syncs Contribution Points| GithubAPI

    %% Frontend to Backend Chat Assistant
    UI -->|POST /api/assistant/chat| Router
    Router -->|Validates & Rate Limits| Middleware
    Middleware -->|Processes Payload| Controller
    Controller -->|Calls LLM Service| Service
    Service -->|Requests Completion with Fallbacks| OpenRouter
    Service -->|Saves Session History| Firestore
```

---

## 🎨 Client-Side Architecture (Next.js Application)

The client application is built on top of React 19 and Next.js 16 utilizing the App Router. The UI layers are styled with Tailwind CSS and animated using Framer Motion and GSAP.

### 📁 Directory Structure

- **`src/app/`**: Next.js App Router folders. Contains page routes, global CSS, layouts, and route handlers.
- **`src/components/`**: Modularized, reusable React components (grouped logically into domains like `auth`, `assistant`, `community`, `projects`, `ui`).
- **`src/context/`**: Global state management providers using the React Context API:
  - `AuthContext.tsx`: Tracks authentication state (Firebase user, login, signup, logout).
  - `GamificationContext.tsx`: Manages streak tracking, contribution points, and leaderboard sync status.
  - `NotificationContext.tsx`: Manages toast feedback, in-app notifications, and alert center state.
  - `RealTimeContext.tsx`: Handles live user count, active pages, or presence updates.
- **`src/lib/`**: Business logic integrations:
  - `firebase.ts`: SDK initialization for Auth and Firestore.
  - `github.ts`: Fetching public repositories, contribution counts, and PR stats.
  - `theme.ts`: Custom dark/light mode configurations.
  - `streakUtils.ts`: Computes login streaks and calculates XP modifiers.

### ⚡ Client-Side State Flow

```mermaid
sequenceDiagram
    participant User as User Browser
    participant UI as Page Component
    participant Context as React Context Providers
    participant Lib as Libs (Firebase/GitHub)
    participant Firestore as Firestore DB

    User->>UI: Action (e.g. claim daily login reward)
    UI->>Context: Call gamification hook `claimStreak()`
    Context->>Lib: Call `streakUtils.ts` calculations
    Lib->>Firestore: Update User Document with new XP & streak fields
    Firestore-->>Lib: Success response
    Lib-->>Context: Return updated state
    Context-->>UI: Update local state / Trigger animations (Confetti)
    UI-->>User: Visual feedback
```

---

## ⚙️ Server-Side Architecture (Express Assistant Backend)

The Express backend orchestrates heavy or secure calculations, specifically focusing on the AI Chat Assistant capabilities. It runs separately (under the `/backend` directory) and communicates with the client via JSON endpoints.

### 📂 File Structure (under `backend/src/`)

- **`app.js`**: Global middlewares configuration (CORS, Express JSON parser, Request logs with Morgan).
- **`routes/assistant.js`**: Defines the assistant pathways. Includes rate-limiting and request payload validator middlewares.
- **`controllers/assistantController.js`**: Resolves HTTP requests, handles errors, and returns JSON formatted chat responses.
- **`services/openRouterService.js`**: Orchestrates OpenAI/OpenRouter chat generation with failover retry patterns.
- **`services/conversationService.js`**: Manages conversational message histories and stores session contexts in Firestore using the Firebase Admin SDK.
- **`middlewares/rateLimitMiddleware.js`**: Prevents brute-force requests and keeps cost consumption predictable.

### 🚀 LLM Multi-Model Failover Orchestration

The assistant service uses a custom failover logic across free OpenRouter endpoints to maintain 100% availability.

```mermaid
flowchart TD
    Start[Receive Chat Message] --> Primary[Try Primary Model: gpt-oss-120b:free]
    Primary -->|Success| Return[Format & Return Response]
    Primary -->|Rate Limit / Timeout / Error| Order[Sort Fallbacks by Weight Override]

    subgraph Fallbacks [Fallback Hierarchy]
        F1[nvidia/nemotron-3-super:free]
        F2[deepseek/deepseek-v4-flash:free]
        F3[qwen/qwen3-next-80b-a3b-instruct:free]
        F4[meta-llama/llama-3.3-70b-instruct:free]
        F5[google/gemma-4-31b:free]
    end

    Order --> F1
    F1 -->|Success| Return
    F1 -->|Fail| F2
    F2 -->|Success| Return
    F2 -->|Fail| F3
    F3 -->|Success| Return
    F3 -->|Fail| F4
    F4 -->|Success| Return
    F4 -->|Fail| F5
    F5 -->|Success| Return
    F5 -->|Fail| ErrorResponse[Throw Centralized Error 502 / OPENROUTER_ERROR]
```

---

## 🗄️ Database & Security Architecture (Firebase)

DevPath utilizes Firebase as a serverless backend helper. Because the frontend talks directly to Firebase, security is enforced via server-side database rules.

### 📝 Database Collections (Firestore NoSQL)

```
/users (user metadata, registration dates, display name, roles)
  ├── /streaks (sub-collection: login streaks, last login timestamps)
  └── /notifications (sub-collection: read/unread notification feed)

/resources (curated learning resources, paths, and wiki articles)
  └── /ratings (sub-collection: user feedback and ratings)

/events (hackathons, workshops, meetups details)
  └── /registrations (sub-collection: RSVP records)

/conversations (saved chat history for the assistant)
```

### 🔒 Firestore Security Rules

To avoid data manipulation, `firestore.rules` enforces that:

- Users can only read and write their own `/users/{userId}` documents, streaks, and notifications.
- Only accounts flagged with the `admin` role are permitted to create, update, or delete entries under `/events` and `/resources`.
- Authenticated users can create registrations and write reviews/ratings.

---

## 🤝 Contribution and Sync Pipelines

DevPath tracks developer progress and gamifies learning through automated sync pipelines.

```mermaid
sequenceDiagram
    participant User as Developer UI
    participant Hook as GitHub Hook / Lib
    participant GitHub as GitHub GraphQL API
    participant DB as Firestore DB

    User->>Hook: Trigger Profile Sync
    Hook->>GitHub: Query Contribution Data (PRs, Commits, Issues)
    GitHub-->>Hook: Return contribution statistics
    Hook->>Hook: Calculate Gamification XP & Badges
    Hook->>DB: Write updated user profile (stats, points, level)
    DB-->>User: Refresh UI with new leaderboard ranking
```

### Point Calculation Rules

- **Pull Request Merged**: High XP yield (+50 pts)
- **Issue Opened/Resolved**: Medium XP yield (+15 pts)
- **Daily Learning Streak**: Consistent daily progress boosts multiplier (up to 1.5x)
