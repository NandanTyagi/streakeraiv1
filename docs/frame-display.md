# Fullscreen frame display

## Open the frame view

On the normal panel, select **Frame view** (this replaces **View image**), or open `/panel/frame`. Tap **Enter fullscreen** to hide the browser bars. The view keeps the Streaker logo/name, intention title, and prominent habit headers. On viewports at least 768 CSS pixels wide (including the tested frame), the grid uses the available width and fits 14 days through today when the current month has reached day 14; earlier in the month it shows the initial 14-day window. Scroll to inspect other dates. Narrower viewports use the existing mobile row-sizing behavior rather than the 14-row desktop calculation.

The top-right control exits fullscreen. Outside fullscreen, **Back to panel** returns to `/panel`. The same panel, authentication, editing, and persistence behavior are used as on the normal panel; this is not a separate image or read-only dashboard.

Browser fullscreen requires a user gesture. After leaving the browser, reopening it, or rebooting, another tap may be necessary. A screen wake lock is requested while fullscreen where supported; browser permission and operating-system behavior still apply. No automatic reload is scheduled for the interactive dashboard. Do not assume unattended remote updates or overnight wakefulness have been verified.

## Android Frameo companion

The tested frame is a Sandstrom SDPF1025 running Android 10 (API 29), with a 1200 x 1920 display. Frame Modes 0.1.5 (`dev.streaker.framemodes`) is a separate sideloaded companion, not part of this web repository. Its source/APK were delivered separately; do not assume this checkout can rebuild that APK.

Configure the companion with:

- URL: `https://streaker-v1.vercel.app/panel/frame`
- **Web dashboard** enabled.
- **Open web dashboard in Firefox** enabled; Firefox must be installed separately.
- Floating **Modes** button enabled. Tap it to switch modes; drag to reposition it.
- **Restore the floating button after reboot** enabled. Version 0.1.5 briefly shows Restoring Modes during boot, restores the overlay, and closes back to Frameo.

The companion explicitly opens Firefox (`org.mozilla.firefox`). Firefox stores its own sign-in. The frame's old system WebView showed an application error during login; Firefox 158.0 ARMv7 successfully rendered the signed-in panel. The system WebView was not replaced.

Frameo (`net.frameo.frame`) stays installed and remains the default Home app. No root, firmware replacement, disabling of apps, or default-launcher change is needed. After setup, USB is unnecessary for everyday use; the frame still needs power and internet access to load online content. For shutdown, use the frame's own shutdown controls before disconnecting power.

The reboot option restores the floating button, not automatic Streaker launch or browser fullscreen. The vendor background manager blocks direct background service starts, so 0.1.5 briefly opens a dedicated startup activity, starts the companion service while visible, and finishes back to Frameo. It does not modify the vendor allow-list, firmware, or default Home app. To undo it, turn off the option in companion settings. To return to family photos, use Modes and select Frameo.

## Implementation pointers

- `app/panel/frame/page.jsx` reuses the panel page.
- `components/MainLayout.jsx` selects `FrameLayout` for `/panel/frame`.
- `components/FrameLayout.jsx` owns branding, fullscreen controls, and optional wake lock.
- `.frame-layout` rules in `app/globals.css` scope frame-specific sizing and header styling.
- `hooks/useMobileGridFit.js` calculates the visible rows; keep `--grid-header-height` a numeric pixel value because the hook parses it numerically.
- `components/v1/PanelFooterControls.jsx` provides the Frame view shortcut.

## Verification record: 2026-10-20

- Production frame changes deployed through commit `0c39780`; live `/panel` contained Frame view and no View image label.
- Local production build passed for the initial frame view with placeholder build configuration. This does not validate external API integrations.
- Browser fixture checks passed at 1200 x 1920, 872 x 1396, and 1920 x 1200: fitted rows, fullscreen entry/exit, denied-request recovery, and no horizontal overflow.
- On the connected SDPF1025, the signed-in frame view displayed the logo, intention title, prominent headers, fitted rows through today, and one draggable Modes overlay. Fullscreen removed browser bars.
- Firefox initially opened a blank tab; restarting the browser without clearing its data recovered the page and preserved sign-in.
- Frameo still resolved as the default Home activity.
- Earlier versions failed automatic restoration: the Allwinner background manager returned null for service starts outside its protected foreground task. Delayed retries did not fix this. Version 0.1.5 uses a brief visible startup activity instead; the overlay then restored automatically and Frameo resumed in two consecutive real reboot tests, without manually opening the companion. The restored Modes button opened the switcher successfully.
- Firefox retained the signed-in panel after reboot. Its initial page briefly appeared signed out; a browser refresh restored the existing session. If this occurs, refresh before attempting sign-in again. Prolonged sleep, overnight operation, and a physical unplug/replug power cycle remain untested.
- Installed companion 0.1.5 APK SHA-256: `d1cabae5707e279e12a631c930f0c676f7bb489ab268a91dc7222dd32cd14a49`.

## Image display remains separate

The existing private `/api/display/...` endpoint remains available for image-based/e-ink integrations. The panel footer now links to Frame view instead of exposing the image shortcut. Never commit an account's private display URL. See README.md for image storage and refresh semantics.
