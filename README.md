# StreakerAi

StreakerAi is a habit-tracking app designed to help users achieve their personal goals through daily habit suggestions. By leveraging the power of AI, StreakerAi provides personalized habit recommendations that align with user aspirations, fostering consistent and meaningful progress.

## Features

- **Personalized Habit Suggestions:** AI-driven recommendations tailored to user goals.
- **Daily Habit Tracking:** Simple interface to track and mark daily habits.
- **Progress Visualization:** Visual representation of progress over time.
- **Customizable Goals:** Users can set and modify their personal goals.
- **Mobile-Friendly:** Designed for a seamless experience on mobile devices.

## Motivation

StreakerAi was inspired by the founder's personal journey of transformation. After a decade of unhealthy lifestyle and a challenging relationship, tracking daily habits on a simple calendar led to a remarkable transformation, including significant weight loss and improved well-being. This experience underscored the power of daily habits and inspired the creation of StreakerAi to help others achieve similar transformations.

## Installation

To get started with StreakerAi, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/NandanTyagi/streakerai.git
    ```

2. **Navigate to the project directory:**
    ```sh
    cd streakerai
    ```

3. **Install dependencies:**
    ```sh
    npm install
    ```

4. **Set up environment variables:**
    - Copy `.env.example` to `.env.local`, fill in your existing database and API settings, and follow the Clerk setup below.
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

5. **Run the development server:**
    ```sh
    npm run dev
    ```

6. **Open your browser and navigate to:**
    ```
    http://localhost:3000
    ```

## Usage

1. **Set Your Goal:**
   - Upon logging in, you will be prompted to set your personal goal.

2. **Receive Daily Habit Suggestions:**
   - Based on your goal, StreakerAi will suggest five daily habits with measurable targets.

3. **Track Your Habits:**
   - Mark off each habit as you complete it every day. Visualize your progress and stay motivated.

## Contributing

We welcome contributions from the community! To contribute to StreakerAi, follow these steps:

1. **Fork the repository:**
    - Click the "Fork" button at the top of this repository.

2. **Clone your forked repository:**
    ```sh
    git clone https://github.com/yourusername/streakerai.git
    ```

3. **Create a new branch:**
    ```sh
    git checkout -b feature/your-feature-name
    ```

4. **Make your changes and commit them:**
    ```sh
    git commit -m "Add your commit message here"
    ```

5. **Push your changes to your forked repository:**
    ```sh
    git push origin feature/your-feature-name
    ```

6. **Create a Pull Request:**
    - Go to the original repository and click "New Pull Request" to submit your changes for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

Visit [Streaker](https://streaker-v1.vercel.app). For questions or feedback, open an issue in this repository.

---

Thank you for using StreakerAi! Let's embark on this journey of personal transformation together.

## Authentication (Clerk)

Authentication uses Clerk's Next.js SDK, with `/sign-in` and `/sign-up` pages.
Successful authentication defaults to `/panel`; signing out returns to `/`.
The public landing pages and anonymous ledger remain available without login.

1. Copy `.env.example` to `.env.local` if you do not already have a local env file.
2. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` using keys from
   the same Clerk application. Keep the secret key server-side only.
3. In Clerk, enable email sign-up/sign-in and require email verification. Configure
   any desired social providers in Clerk (including their production credentials).
4. Set the same environment variables in your deployment and configure Clerk's
   production domains before deploying. The old `KINDE_*` variables are unused.

Existing MongoDB users, panels, and v3 data remain keyed by email. Users must sign
in to Clerk with the same **verified primary email** to access their existing data.
The user API and panel creation provision MongoDB users automatically; no Clerk
webhook is required. V3 endpoints derive the user identity from the Clerk session.
Changing a user's primary email changes the legacy data key and requires a separate
account-data migration.

Kinde sessions and passwords are not transferred by this code change. Existing
users must sign in/register through Clerk, or be imported using a separately planned
Clerk user migration. Do not remove the Kinde application until that rollout is done.

Validation: `npm run test:auth`, `npm run test:v3`, `npm run lint`, and `npm run build`.
For a manual smoke test, verify sign-up, sign-in, sign-out, a new user's first panel,
and an existing user's panel/history with a matching verified email in both v3
and legacy modes. Signed-out user and v3 APIs should reject access.

### Clerk on the Vercel production domain

For `streaker-v1.vercel.app`, set `NEXT_PUBLIC_CLERK_PROXY_URL=https://streaker-v1.vercel.app/__clerk` in Vercel Production alongside the matching live Clerk keys. The `/__clerk` route forwards only to Clerk's Frontend API, keeps the secret server-side, and disables session caching. Leave the proxy variable unset for local development keys.

After deployment, verify the proxy under Clerk > Domains. Google production sign-in also requires custom Google OAuth credentials in Clerk, with `https://streaker-v1.vercel.app/__clerk/v1/oauth_callback` registered as an authorized redirect URI in Google Cloud. Development's shared Google credentials do not work in production.

### E-ink display

Signed-in panel edits save automatically after a short pause. Display-enabled accounts also update the display image after a successful save. The status shows progress or a **Retry** action if persistence or image generation fails. The image is rendered at
480 Ã— 800 in black and white, showing days 1â€“14 initially as today moves down the grid. From day 15, the latest 14 days roll forward with today at the bottom and older days moving off the top. Row sizes stay fixed. It captures the current
saved panel.

The **View image** button is a stable, account-specific
image URL. Configure the frame to fetch that URL on its normal refresh schedule.
Anyone with this unguessable URL can view the image, so treat it as a private link.
Uploads require a verified signed-in account and are stored in MongoDB's
`display_images` collection using the existing v3 database configuration. Responses
are not cached. A successful display update confirms image storage, not a hardware refresh acknowledgment.

The old `/screenshots/currentScreenshot.png` is a bundled historical image and is
not an upload destination on Vercel. Devices using it must switch to the new link.

Dashboard totals and Top Streak use the selected month, through today for the current month. Unreviewed days break consecutive streaks. Hit Rate is Done / (Done + Missed); no reviewed days displays a dash.

### Multiple panels and Identify

Identify (`/generategoals`) calls the authenticated `/api/identify` endpoint using the server-only `OPENAI_API_KEY` and optional `OPENAI_IDENTIFY_MODEL` (default `gpt-4o`). It validates structured JSON containing five habits. Missing credentials, upstream errors, and incomplete output are shown without modifying saved panels. No browser API key or Assistant/thread configuration is required.

Generated panels are drafts until **Save panel** is chosen in the footer. The panel selector switches between saved panels and the current draft; pending writes finish before switching. Saved panels retain separate goal IDs, habits, cells and history. The selected panel is remembered on this browser. **Make main** selects the panel used by the stable display URL. The server rejects uploads from any other panel; switching the active panel alone does not switch the display. Reset is in the footer, with a confirmation scoped to the active panel.
