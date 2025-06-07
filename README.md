

# 🏗️ WeWantWaste — Skip Selector UI

* **Author:**  Kennedy Kiprono
* **Submission Date:** *June 7, 2025*
* **Submission Type:** Technical Assessment – Frontend Challenge


---

## 📘 Overview

This project is a **Skip Selection Interface** built as part of a technical assessment for WeWantWaste. It allows users to:

* View a list of skips based on a real API
* Filter skips by size, price, or waste type compatibility
* Select a skip and continue the booking process
* Retain selection state between reloads
* View contextual pricing with VAT

My approach focused on usability, code clarity, performance, and maintainability.

---

## ⚙️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React hooks
* **Image Handling:** `next/image`
* **Build Tool:** Vite (via Next internal tooling)
* **Deployment:** CodeSandbox / GitHub Pages

---

## 📁 Folder Structure

```
/app
  ├── components/
  │     ├── ProgressBar.tsx
  │     ├── SkipCard.tsx
  │     ├── SkipList.tsx
  │     └── ContinueButton.tsx
  ├── types/
  │     └── skip.ts
  ├── page.tsx
  └── layout.tsx
```

---

## 🧩 Core Components

### `SkipCard.tsx`

* Renders visual details for a skip
* Clickable/selectable with keyboard support
* Conditionally shows "On-road" and "Heavy Waste" tags only when applicable

### `SkipList.tsx`

* Fetches skips from a remote API
* Filters by:

  * Size (search)
  * Price range
  * Feature flags
* Applies real-time filtering with validation
* Handles errors and empty states

### `ContinueButton.tsx`

* Floating button shown only when a skip is selected
* Displays price (with VAT), size, and duration
* Supports back and continue navigation (stubbed)

### `ProgressBar.tsx`

* Displays current step in booking process
* Static component with styled indicators

---

## 🔐 Types & State Management

I created a centralized `Skip` type under `app/types/skip.ts`:

```ts
export interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  price_before_vat: number;
  vat: number;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}
```

This is shared across all components to ensure consistency and full TypeScript support.

**State is managed using React hooks**, lifted up to `page.tsx`:

* `selectedSkipId` is persisted in `localStorage`
* Selection updates the floating bar and re-renders selected cards

---

## 🔄 Data Flow

```
API → SkipList → SkipCard
                ↓
         onSelect(skip.id)
                ↓
       page.tsx (state update)
                ↓
       ContinueButton renders
```

This uni-directional flow ensures tight control and no duplication of logic.

---

## 🌐 API Usage

I used the provided endpoint:

```
GET https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft
```

To ensure robust handling, I included:

* Try/catch error handling
* Fallback to empty state message
* Lazy loading and conditional rendering

---

## 🧪 Features & Enhancements

| Feature                 | Status | Notes                                     |
| ----------------------- | ------ | ----------------------------------------- |
| Skip filtering by size  | ✅      | Live search with debounce-ready structure |
| Min/max price filtering | ✅      | Includes validation and range enforcement |
| Filter by feature flags | ✅      | On-road and heavy waste toggle support    |
| VAT-inclusive pricing   | ✅      | Displayed consistently across UI          |
| Image previews          | ✅      | Responsive, uses `next/image`             |
| Floating Continue bar   | ✅      | Dynamically shown/hidden                  |
| Keyboard accessibility  | ✅      | Focus, enter, and aria support            |
| Dark mode styling       | ✅      | Enabled via Tailwind’s dark class         |
| Type-safe throughout    | ✅      | All components use shared interfaces      |

---

## 💡 Decisions Made

* **Type centralization**: To avoid drift between components and simplify future API updates.
* **LocalStorage integration**: To create a seamless experience where the selection persists between reloads.
* **Modular components**: To keep the UI testable, readable, and reusable.
* **Conditional rendering**: To avoid empty containers (like the feature tag block) when unnecessary.
* **ProgressBar as static**: Left dynamic behavior out for now but easy to extend with a state prop later.

