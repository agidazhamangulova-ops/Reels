# Promo videos (Remotion)

## PlumoPromo — 1080×1920, 52 s

Vertical Plumo reel in the same style and on the same beat grid as the Pulse cut.

- `src/PlumoPromo.tsx` – timeline
- `src/plumo/scenes.tsx`, `src/plumo/ui.tsx` – scenes and the Plumo UI (chat, заявка card, dashboard)
- `public/plumo/man-blue.mp4` – the night shot, regraded from green to blue

```bash
npx remotion render PlumoPromo out/plumo-promo.mp4
```

## PulsePromo

52-second 1920×1080 promo for Pulse, rebuilt shot-for-shot from the reference edit.

- `src/PulsePromo.tsx` – the timeline (seconds → scenes)
- `src/pulse/scenes.tsx` – every scene
- `src/pulse/ui.tsx` – the Pulse app UI drawn in React (overview, content, sources, contacts, journey, funnel builder, workspace modal)
- `src/pulse/text.tsx` – kinetic type, pills, typewriter
- `public/footage-*.mp4`, `public/soundtrack.m4a` – the two live-action shots and the music, cut from the reference video

```bash
npm i
npx remotion studio                       # preview / edit
npx remotion render PulsePromo out/pulse-promo.mp4
```

In an offline sandbox add `--browser-executable=/path/to/chrome-headless-shell`.
