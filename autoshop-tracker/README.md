# 🚗 AutoShop Tracker

A job management dashboard built for automotive tint, wrap, and PPF shops. Shop managers or technicians can track every vehicle through the full service pipeline - from intake to quality check to completion, with real-time drag and drop status updates, technician assignment, and a complete job intake form backed by a live Postgres database.

## 🔗 Live Demo

[autoshop-tracker.vercel.app](https://autoshop-tracker-khaki.vercel.app/)

## 📸 Preview

![AutoShop Tracker Dashboard](./preview.gif)

// Need to add a short gif use [ScreenToGIf](https://screentogif.com/) (Windows)

---

## ✨ Features

- **Kanban-style pipeline** - four stages: Intake, In Progress, Quality Check, and Complete
- **Drag and drop** - move job cards between columns; status updates instantly in the UI and persists to the database
- **Job intake form** - submit new orders with customer info, vehicle details, service type, priority, due date, and technician assignment - validated before submission
- **Detail view** - click any card to open a full job detail modal
- **Live search** - filter jobs by customer name or plate number in real time
- **Service filter** - filter the board by Tint, Wrap, or PPF
- **Stats bar** - at-a-glance counts for total jobs, in progress, overdue, and complete
- **Ghost cards** - empty columns show a placeholder card shape instead of a blank space
- **Skeleton loading** - animated placeholder cards display while data fetches from the data base
- **Success toast** - slide-up confirmation notification on new job submission, auto-dismisses after 4 seconds
- **Overdue indicators** - past-due jobs surface a red warning on the card automatically
- **Responive layout** - horizontal scroll on mobile, 2-column grid on tablet, full 4-column layout on desktop

---

## 🛠 Tech Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | React 18 (Vite)                   |
| Styling     | Tailwind CSS                      |
| Drag & Drop | @dnd-kit/core + dnd-kit/utilities |
| Database    | Supabase (Postgres)               |
| Deployment  | Vercel                            |

---

## 🧠 Architecture Decisions

**Unindirectional data flow - all state lives in 'App'**
Every piece of state (`jobs`, `search`, `serviceFilter`, `activeJob`, `toast`) lives in the root 'App' component and flows down to children via props. This was a deliberate choice over adding a state management library like Redux or Zustand. For an app of this scope, lifting a state up keeps the data flow explicit and easy to trace - any change to the board can be found in one place.

**Optimistic UI with database-first updates**
When a card is dragged to a new column or a new job is submitted, the Supabase write happens _before_ the local state update. If the database call fails, the UI never changes and the board stays in sync with the source of truth. This prevents the silent data drift that happens when you update the UI first and hope the backend catches up.

**Ghost cards vs skeleton cards - a deliberate UX distinction**
Two different empty states serve two different purposes. Ghost cards (static, dashed border, no animation) appear when a column has no jobs - they communicate shape and structure without implying anything is loading. Skeleton cards (animated pulse) appear while data is fetching from Supabase - they communicate that content is incoming. Using the wrong one in either context would send the wrong signal to the user.

**'useMemo' for filtering**
Search and service filter are computed with `useMemo` so the filter only recalculates when `jobs`, `search`, or `serviceFilter` actually change - not on every render. Stats are also memoized separately and always computed from the full `jobs` array, not the filtered subset, so the numbers never lie based on what filter is active.

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account with a `jobs` table (see schema below)

### Setup

```bash
git clonse https://github.com/whaleism/tba
cd autoshop-tracker
npm install
```

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=my-project-url
VITE_SUPABASE_ANON_KEY=my-anon-key
```

```bash
npm run dev
```

### Supabase Table Schema

Create a table named `jobs` with the following columns:

| Column        | Type               |
| ------------- | ------------------ |
| id            | text (primary key) |
| customerName  | text               |
| phone         | text               |
| plateNumber   | text               |
| year          | int4               |
| make          | text               |
| model         | text               |
| color         | text               |
| serviceType   | text               |
| serviceDetail | text               |
| status        | text               |
| priority      | text               |
| createdAt     | text               |
| dueDate       | text               |
| technician    | text               |
| notes         | text               |

Disable Row Level Security on the `jobs` table, or configure policies for your use case.

---

## 🗺 Roadmap

- [ ] Technician accounts with Supabase Auth - each tech logs in and sees their assigned jobs
- [ ] Edit job details inline from the detail modal
- [ ] Delete / archive completed jobs
- [ ] Status change timestamps - "moved to In Progress on May 12"
- [ ] Email or SMS notifications when a job is marked Complete
- [ ] Dark/light mode toggle

---

## 👤 Author

**Jenny Lee**

[Portfolio](https://jennyleedev.vercel.app) · [LinkedIn](https://www.linkedin.com/in/lee-jens16/) · [GitHub](https://github.com/whaleism)
