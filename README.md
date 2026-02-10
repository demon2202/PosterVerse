# PosterVerse 🎨

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-purple)

**PosterVerse** (internally codenamed *FrameShift*) is a visually striking, production-ready social web application designed for digital artists and designers. It allows users to publish poster artwork, follow creators, discover inspiration through immersive feeds, remix designs, and track analytics.

Built with **React 19**, **TypeScript**, and **Tailwind CSS**, it features a fully persistent local state management system that simulates a real backend experience.

---

## 🌟 Key Features

### 1. Immersive UI/UX
*   **Cyberpunk/Minimalist Aesthetic:** Dark mode by default with glowing accents, grain overlays, and glassmorphism.
*   **Advanced Animations:** Uses **Framer Motion** for shared element transitions (hero images expand seamlessly), layout animations, and micro-interactions.
*   **GSAP ScrollTrigger:** Horizontal scroll animations in the Hero section.
*   **Interactive Backgrounds:** Custom HTML5 Canvas beam grid animations.

### 2. Social Interactions
*   **Feed & Stories:** Instagram-style stories rail and a main feed with filtering (3D, Typography, Abstract, etc.).
*   **Spotlight:** A daily featured poster with a "trending" algorithm.
*   **Engagement:** Full Like, Save (Bookmark), and Follow system.
*   **Messaging:** Real-time chat simulation with read receipts and thread management.

### 3. Creative Tools
*   **Upload Studio:** Drag-and-drop image upload with title/tagging.
*   **Remix Studio:** A powerful feature allowing users to apply CSS/Canvas filters (Noir, Cyber, Glitch) to existing posters and save them as new "Remixes".
*   **Download:** Direct high-quality download of poster assets.

### 4. Creator Economy
*   **Analytics Dashboard:** Visual charts tracking views, likes, saves, and geographic reach.
*   **Profile Management:** Edit profile details (Bio, Avatar) and view organized tabs for Uploads, Saved items, and Collections.

---

## 🛠️ Tech Stack & Dependencies

*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM (v7)
*   **Animation:** 
    *   `framer-motion` (UI transitions)
    *   `gsap` (Scroll-based animations)
*   **Icons:** Lucide React
*   **State Management:** React Context API + LocalStorage (Custom persistence layer)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/posterverse.git
    cd posterverse
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:5173` (or the port shown in your terminal).

---

## 📂 Project Structure & Code Explanation

Here is a deep dive into how the application is architected.

### 1. State Management (`context/GlobalContext.tsx`)
This is the "brain" of the application. Instead of a backend, we use a sophisticated Context Provider.
*   **Data Persistence:** It uses `localStorage` to save Users, Posters, Likes, Follows, and Messages. This means if you reload the page, your data remains.
*   **Mock Database:** The `DB` object defines keys (`pv_users`, `pv_posters`) used to read/write to browser storage.
*   **Reactive State:** `useState` is synchronized with `localStorage`. When you `register()`, it updates the state *and* writes to storage immediately, ensuring the UI updates instantly.
*   **Hydration:** Functions like `getAllPosters` map over raw data and "hydrate" it by finding the corresponding User object for every `creatorId`, mimicking a SQL `JOIN`.

### 2. Core Components

#### `components/Hero.tsx`
*   **GSAP Integration:** Uses `useLayoutEffect` to initialize a horizontal scroll animation using `ScrollTrigger`.
*   **BeamGridBackground:** A custom Canvas component that draws animated glowing lines. It uses mathematical logic to spawn "beams" that travel along a grid, calculating intersections to draw glowing nodes.

#### `components/PosterModal.tsx` & `PosterCard.tsx`
*   **Shared Element Transitions:** We use Framer Motion's `layoutId`. When you click a card, the image "morphs" into the modal position seamlessly.
*   **Logic:** The modal handles Zoom, Download (creating a temporary `<a>` tag), and opens the Remix Modal.

#### `components/RemixModal.tsx`
*   **Image Processing:** This component doesn't just apply CSS filters. When you click "Save", it draws the original image onto an invisible HTML5 `<canvas>`, applies the selected filter using `ctx.filter`, and exports the result as a new Base64 Data URL. This creates a real, new image asset in the app.

#### `components/Navbar.tsx`
*   **Search Logic:** Contains a robust search algorithm that filters users by username/name and posters by title/tags. It supports keyboard navigation (Arrow keys) through results.

### 3. Pages

#### `pages/Home.tsx`
*   **Performance:** Hooks are declared unconditionally at the top level to prevent React "Rendered more hooks" errors.
*   **Computed Values:** Uses `useMemo` to calculate the "Spotlight Poster" (random or latest) and "Suggested Users" (users you don't follow yet) to avoid recalculating on every render.

#### `pages/Explore.tsx`
*   **Recommendation Algorithm:** The `sortedPosters` useMemo hook implements a weighted scoring algorithm:
    *   +100 points: Your own uploads.
    *   +10 points: New uploads.
    *   +5 points: Posters matching tags of posts you've previously Liked or Saved.
    *   +0.001 points: Per like (popularity).

#### `pages/Messages.tsx`
*   **Thread Logic:** Groups linear messages into "Threads" based on unique user pairings. It calculates unread counts and sorts conversations by the most recent message timestamp.

### 4. Authentication (`pages/Login.tsx`)
*   **Dual Mode:** Handles both Login and Registration in a single component with animated transitions.
*   **Validation:** Checks against the `allUsers` context to ensure unique usernames/emails before writing to the local "database".

---

## 🎨 Design System

The app uses a strict Tailwind configuration found in `index.html` (script tag):

*   **Colors:**
    *   `accent`: `#8b5cf6` (Violet) - Used for primary actions and glows.
    *   `darkBg`: `#050505` - A deep black (darker than gray-900) for OLED-friendly aesthetics.
*   **Fonts:**
    *   `Space Grotesk`: Used for Headings and Display text (Futuristic feel).
    *   `Inter`: Used for body text (Readability).
*   **Effects:**
    *   `grain`: A fixed SVG noise filter overlay applied in `index.html` to give the app a textured, cinematic film look.

---

## 🔮 Future Improvements

While this is a robust demo application, a real-world deployment would require:
1.  **Backend Integration:** Replacing `GlobalContext` mock logic with Supabase, Firebase, or a Node.js/PostgreSQL backend.
2.  **Image Hosting:** Currently, images are Base64 strings (which can be large) or Unsplash URLs. A real app would use AWS S3 or Cloudinary.
3.  **Real-time Sockets:** Replacing the message polling logic with Socket.io for instant chat.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ by Harshit 
