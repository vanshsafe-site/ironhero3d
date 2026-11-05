# Iron Hero — City Defender

A browser game with an articulated armored hero, a populated city, and escalating Ultra Bot / Ultronium encounters. Three.js r128 is bundled in `vendor/` with its MIT license. No build step or CDN is required.

## Run

Run `npm start` (Python 3 required), then open `http://localhost:8000`. Serve over HTTP rather than opening index.html directly. Audio begins after pressing Deploy Suit.

## Controls

- WASD: move; mouse / right mouse drag: aim; click or hold: rapid repulsors.
- F: flight; Space: jump / ascend; C: descend; Shift: boost.
- Q: homing missiles (25 energy); E: nova (40 energy).
- P / Escape: pause. Resume or restart from the menu.
- Touch: left joystick, right-side drag to aim, labeled action buttons.

Mobile gameplay requires a browser supporting fullscreen and landscape. Orientation lock is attempted; if unavailable, rotate the device manually. Unsupported browsers show an explanation.

## Gameplay

Each round has 20 × 2^(wave − 1) drones, dispatched in groups of up to 20 to bound the active scene. Defeat all drones, then Ultronium. Regular repulsors cost 2 arc energy per shot and one-shot drones; firing pauses below 2 energy until recharge allows another shot. Continuous fire drains energy faster than it regenerates; missiles and nova do more boss damage. Boss health starts at 800 and increases 50% each round. Armor regenerates slowly; defeating the boss restores some armor and all energy.

The full day/evening/night cycle lasts two minutes. Building damage is cosmetic, not structural destruction. Reflections use a shared local cubemap and are approximate, not planar mirrors. Graphics quality controls render resolution and reflection frequency; use Performance on mobile. Personal best and quality persist in local browser storage when available.

## Structure

- `src/game.js`: scene setup, input, mission state and main loop.
- `src/hero/`: procedural articulated character models and animations.
- `src/systems/`: combat queries, collision / spatial indexing, city population, street details, reflections, lighting, audio, mobile input and settings.
- `styles/game.css`: menu, HUD and responsive touch controls.
- `tests/`: geometry / collision regression checks and scene-graph runtime smoke tests.

## Verification

Run `npm test` with Node.js 22+. Tests use actual bundled Three.js scene objects with mocked browser/WebGL I/O. They cover continuous shot collision, walls/roofs/curbs, wave counts, boss transitions, restart state and rig setup. These tests do **not** validate rendering, audio output, or physical touch devices. Browser testing is still required for visual quality and measured frame rate.

## Public website, SEO and Vercel

`index.html` is the public landing page. Its game description, controls, FAQs and play links are ordinary HTML, visible with JavaScript disabled. The game now lives at `/play.html`; all game asset paths are unchanged. The home page has descriptive metadata, Open Graph / Twitter tags, a canonical URL and VideoGame JSON-LD. `robots.txt` and `sitemap.xml` use `https://ironhero3d.vercel.app`.

Run `npm run build` to create `dist/` from an explicit allowlist of public files. `vercel.json` sets Framework to Other, the build command to `npm run build`, and output directory to `dist`. Import or redeploy this repository in the existing **ironhero3d** Vercel project, with this folder as its Root Directory. No Python runtime or server process is needed on Vercel. The Python command remains only a local development convenience.

After deploying, check `/`, `/play.html`, `/robots.txt` and `/sitemap.xml` on the production domain. Ensure production is publicly accessible (not behind deployment authentication), then submit `https://ironhero3d.vercel.app/sitemap.xml` in Google Search Console. Crawlable pages make indexing possible; indexing and search ranking are not guaranteed. Update the canonical URLs, sitemap and JSON-LD if the domain changes.
