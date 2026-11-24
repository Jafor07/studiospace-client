# StudioSpace

**Peer-to-peer creative workspace and production studio sharing platform.**
Studio owners list photo studios, sound stages, podcast lounges, music suites and art workshops. Creators discover them, check pricing, and book hourly slots.

**Live site:** https://studiospace-client-sand-seven.vercel.app
**Live API:** https://studiospace-server-rouge.vercel.app
**Client repository:** https://github.com/Jafor07/studiospace-client
**Server repository:** https://github.com/Jafor07/studiospace-server

## Features

- **Hero slider and featured studios**: a four-slide Swiper hero, plus the six top-rated studios loaded live from MongoDB.
- **Explore Studios**: search, category filter and sorting. Filters live in the URL, so reloading or sharing a link keeps them. Friendly empty states everywhere.
- **Full studio CRUD**: add, update and delete your own listings with toast feedback and a custom confirmation modal (no browser alerts).
- **Booking system**: pick a date, start time and hours, see the total with deposit, and send a request that starts as `Pending`. Guests can cancel pending bookings.
- **Host dashboard**: hosts confirm, decline or complete booking requests and see their booked earnings.
- **Secure authentication**: email and password (uppercase, lowercase, 6+ characters) and Google login with BetterAuth. Private routes stay logged in after a reload.
- **Reviews and ratings**: logged-in guests rate studios, and the average updates automatically.
- **Light and dark theme** that remembers your choice.
- **Optional extras**: saved-studios wishlist (heart icon) and a downloadable PDF booking invoice.

### Challenges completed

1. **JWT security with HTTPOnly cookies**: the browser only holds BetterAuth's HTTPOnly session cookie. A Next.js route turns it into a short-lived JWT on the server and calls Express, which verifies it against the JWKS public keys and answers `401 Unauthorized` otherwise. Owners are always read from the token, never from the request body.
2. **Double-booking prevention**: before a booking is saved, and again when a host confirms it, the server checks for overlapping `Confirmed` bookings and rejects clashes with a clear message (`409`).
3. **Theme customization**: a light/dark toggle that restyles the whole site with no flash on load.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, Tailwind CSS, daisyUI, Swiper, react-hot-toast, react-icons, jsPDF |
| Auth | BetterAuth, MongoDB adapter, JWT plugin, Google OAuth |
| Backend | Express.js, jose (JWT verification) |
| Database | MongoDB Atlas |
| Hosting | Vercel |
| Photos | Free stock photos from [Pexels](https://www.pexels.com) |

## Run it locally

1. Clone this repo and the [server repo](https://github.com/Jafor07/studiospace-server).
2. In this folder: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the MongoDB URI, a long random `BETTER_AUTH_SECRET`, and Google OAuth keys.
4. Set `NEXT_PUBLIC_IMGBB_API_KEY` in `.env.local` to enable photo uploads. Without it, users can still enter an image URL manually.
5. Start the server (see its README), then run `npm run dev` here.
6. Open http://localhost:3000

## Examiner test accounts

Register both accounts on the live site before evaluation — they are not created automatically. Then seed the database so the sample studios belong to the host account.

| Role | Email | Password |
|---|---|---|
| Guest (books studios) | `guest@studiospace.com` | `Guest1234` |
| Host (owns the sample studios) | `host@studiospace.com` | `Host1234` |

### Examiner testing workflow

**1. Create the accounts** (order matters: host first)

On the live site (`https://studiospace-client-sand-seven.vercel.app`):

1. Register as `host@studiospace.com` / `Host1234` — this becomes the studio owner.
2. Register as `guest@studiospace.com` / `Guest1234` — this becomes the booker.

**2. Seed the sample studios (host only)**

From the server folder, run:

```
npm run seed -- host@studiospace.com "Studio Host"
```

This creates 8 sample studios (photo, film stage, podcast, music, workshop) owned by `host@studiospace.com`. They appear on the home page, the Explore Studios page, and the host's `/my-listings`.

**3. Test the complete booking workflow** (two browser sessions)

| Step | Browser A (Guest) | Browser B (Host) |
|---|---|---|
| 1 | Log in as `guest@studiospace.com` | Log in as `host@studiospace.com` |
| 2 | Open a studio details page and click **Book Workspace Now** | — |
| 3 | Pick a date/time and send the request → status becomes **Pending** | — |
| 4 | — | Open **Dashboard** → **Booking requests** → click **Confirm** |
| 5 | Booking status changes to **Confirmed** | — |
| 6 | Try booking the same studio at the same time → server rejects with **409 conflict** | — |
| 7 | Open **My Bookings** → click **Download Invoice** → PDF downloads | — |

**4. Test private-route reloads**

While logged in as either account, open and reload each of these pages — none should redirect to `/login`:

- `/dashboard`
- `/my-listings`
- `/my-bookings`
- `/studios/edit/[id]` (open one of your own studio listings first)

**Tip:** Use two separate browsers (or incognito windows) so the guest and host sessions don't interfere with each other.
