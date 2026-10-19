# Streaker mobile walkthrough

A 720 x 1280 portrait instructional video, 24 fps, about 2 minutes 40 seconds.
The mobile screens are illustrated demonstrations based on the current app components, with fictional example data. They are not a recording of a real account. No user data, account tokens, or live display links are embedded.

## Files
- `chapters.json`: narration script.
- `voice.mjs`: ElevenLabs narration and timestamp alignment generator. Reads the API key from the environment file passed as its first argument; never writes the key.
- `timeline.json`: chapter and caption timing generated from speech alignment.
- `index.jsx` and `video.css`: deterministic Remotion mobile scenes and tap indicators.
- `public/*.mp3`: generated narration, using Embla's configured ElevenLabs voice.
- `public/*.json`: speech timing, without audio base64 or credentials.
- `render.mjs`: still-frame and H.264/AAC rendering.
- Final assets: `../../public/videos/streaker-mobile-*`.
- App player: `../../components/WalkthroughVideo.jsx`, below the original About video.

## Rebuild
Run commands from this directory. Install the locked packages with `npm ci` (use a workspace-local npm cache if needed).

1. If changing narration, edit `chapters.json`. Remove only the cached MP3 and alignment JSON for the changed chapter, then run `node voice.mjs <path-to-authorized-env-file>`.
2. The voice script also updates `../../lib/walkthrough.json` chapter metadata and the WebVTT captions.
3. `npm run stills` produces review frames.
4. `npm run render` produces the final MP4 and poster. Set `RENDER_BROWSER` if Chrome is installed elsewhere.
5. `npm run verify` decodes the entire video, checks caption text, records its checksum, and extracts encoded frames for visual review. Set `FFMPEG` if needed.

The renderer uses a separate headless Chrome process solely for rendering the authored composition, without a user profile or authenticated session. It does not automate the live app.

## Accuracy notes
- Marks cycle from unreviewed to done, missed, and unreviewed. Pause between taps to avoid the double-click clear gesture.
- Hold a marked cell for two seconds to add or edit a note; choose Done to save it.
- Column dialogs edit Activity and Value. Existing saved panels autosave; drafts require Save panel.
- Dashboard and Profile & settings require sign-in.
- The display URL is a public-by-link image of the main panel. The receiving browser or display device must reload the image to retrieve updates. Support depends on the device's browser/image URL capability; no universal screen compatibility is claimed.

Voice API reference: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps/

## Framing verification
The ledger reserves the footer height in normal flow and a 16 px gutter below its last row. A render-time layout assertion rejects overlap or a gutter below 15 px. The example-data label sits outside the phone. `npm run stills` includes tick, cross, blank, and closed-dialog grid states for visual review. Re-render the whole composition after layout changes; do not splice earlier clips into it.

## Display photograph (revision 3)
The display chapter transitions from the mobile image preview to a product cutout derived from the user's real oak-frame photograph. Narration, captions, chapter timing, and the corrected ledger gutter are retained. `render-display.mjs` renders this chapter and assembles it with the verified revision 2 video, preserving its audio; `render.mjs` still rebuilds the entire current composition from source.
The homepage now includes the walkthrough and a display feature. The old YouTube embed has been removed from About.
Image provenance and prompts: `../../public/images/display/README.md`.
