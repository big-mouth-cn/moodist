# AGENTS.md

## Project Overview

Moodist X is an Astro 4 single-page static web app for building ambient
soundscapes. The page is mostly server-rendered Astro content with React islands
for the interactive app. Users can layer looped ambient sounds, tune per-sound
volume, save presets, share mixes through URLs, run focus tools, and install the
site as a PWA.

The app is intentionally browser-only for the interactive parts: audio playback,
local persistence, Media Session controls, timers, and URL imports all run in
client-loaded React components.

## Stack and Tooling

- Package manager: `pnpm` with `pnpm-lock.yaml`.
- Framework: Astro with `@astrojs/react`.
- UI: React 18, CSS Modules, Radix primitives, React Icons, `motion` /
  `framer-motion`, `focus-trap-react`.
- Audio: Howler.js for file-backed sounds and effects; Web Audio API for
  generated binaural and isochronic tones.
- State: Zustand stores, mostly persisted to `localStorage`.
- PWA: `@vite-pwa/astro`, prompt registration, full asset caching.
- Formatting/linting: Biome. Run `pnpm run check` or `pnpm run check:fix`.
- Build: `pnpm run build`; local dev: `pnpm run dev`.
- Docker: multi-stage Node build served by Caddy on port `8080`.

## Entry Points

- `src/pages/index.astro` composes the home page: static sections plus
  `CategoryIcons` and `App` as `client:load` React islands.
- `src/layouts/layout.astro` defines metadata, global CSS, PWA manifest tag, and
  mounts the update `Reload` island.
- `src/components/app/app.tsx` is the interactive application root. It wraps
  state hydration, snackbar context, media controls, global buttons, categories,
  toolbar/menu, and shared-link import modal.
- `src/styles/global.css` imports base styles, fonts, and variables.

## Directory Map

- `src/data/sounds.ts` and `src/data/sounds/*.tsx`: sound catalog grouped by
  category. Each sound has `{ id, label, icon, src }`.
- `public/sounds/**`: audio files referenced by the catalog and tools.
- `src/stores/**`: Zustand stores for sounds, presets, settings, note, todo,
  sleep timer, pomodoro, and loading state.
- `src/hooks/**`: browser-safe hooks for Howler playback, local storage, copy,
  close listeners, theme detection, keyboard button behavior, and SSR checks.
- `src/components/sounds/**`: category sound grid, individual sound tile,
  favorite button, and volume slider.
- `src/components/categories/**`: category layout and category navigation icons.
- `src/components/buttons/**`: global play/pause and unselect controls.
- `src/components/toolbar/**`: fixed toolbar, menu trigger, menu items, and
  scroll-to-top.
- `src/components/modals/**`: share, presets, settings, shortcuts, sleep timer,
  breathing, binaural, isochronic, and lofi modals.
- `src/components/toolbox/**`: Pomodoro, countdown, todo, notepad, and shared
  toolbox controls.
- `src/lib/**`: small shared utilities for custom events, modal broadcasting,
  motion variants, sound counting, and confetti.
- `src/helpers/**`: generic helpers for style class joining, browser detection,
  random selection, number formatting, paths, download, counters, and delays.

## Core Sound Model

`src/stores/sound.ts` is the central store. On startup it derives one
`SoundValue` per catalog item:

```ts
{
  isFavorite: false,
  isSelected: false,
  volume: 0.5,
}
```

Important actions:

- `select(id)` marks a sound selected.
- `unselect(id)` clears selection for one sound.
- `unselectAll(pushToHistory?)` clears all selections, resets volumes to `0.5`,
  and can keep a restorable history snapshot.
- `setVolume(id, volume)` updates the per-sound volume.
- `play()`, `pause()`, and `togglePlay()` control the global playback flag.
- `shuffle()` selects four random sounds, assigns random volumes from `0.2` to
  `1`, and starts playback.
- `override(record)` replaces the active selection from a `{ soundId: volume }`
  map. This is used by presets and shared URLs.
- `toggleFavorite(id)` persists favorite status.
- `lock()` / `unlock()` temporarily prevent tile interactions during global
  fade-out.

Only `sounds` is persisted under `moodist-sounds`. The global `isPlaying`,
`locked`, and history state are session-only.

## Playback Flow

The main playback chain is:

1. `App` renders categories from `src/data/sounds.ts`.
2. Each `Sound` tile reads its selection, per-sound volume, global play state,
   and lock state from `useSoundStore`.
3. `Sound` multiplies per-sound volume by `useSettingsStore().globalVolume`.
4. `useSound(src, { loop: true, volume })` creates a Howler `Howl` lazily in the
   browser.
5. When a tile is selected and global playback is on, the hook loads/plays the
   file and loops it; otherwise it fades down and pauses.
6. Loading state is tracked in `useLoadingStore` by audio `src`, allowing the
   tile to show a spinner.

`useSound` uses a short fade for play/pause transitions and listens for the
global `FADE_OUT` event. `App` also listens for `FADE_OUT`, locks sound input,
waits for the provided duration, then pauses all sounds and unlocks input.

Howler's global audio context is resumed on `visibilitychange` when the document
becomes visible again, which helps recover playback after browser suspension.

## Persistence and Hydration

Persisted Zustand stores use `skipHydration: true` and explicitly rehydrate in
`src/components/store-consumer/store-consumer.tsx` after the React island mounts.
This pattern avoids SSR/browser mismatch from reading `localStorage` too early.

Persisted stores:

- `moodist-sounds`: selected sounds, volumes, favorites.
- `moodist-settings`: global sound volume and alarm volume.
- `moodist-presets`: saved preset list, with migration adding preset IDs.
- `moodist-todos`: todo items.
- `moodist-note`: notepad content.

`useLocalStorage` is also used for smaller component-local preferences, such as
expanded sound category sections and Pomodoro custom durations.

## Sharing and Presets

The share modal (`src/components/modals/share-link/share-link.tsx`) serializes
the current selected sounds into a compact JSON object:

```json
{ "rain": 0.5, "fire": 0.35 }
```

It encodes that object into `?share=...`. `SharedModal` parses this query
parameter on load, validates IDs against the catalog, removes the query string
from browser history, and asks the user whether to override the current mix.

Presets live in `src/stores/preset.ts`. A preset is `{ id, label, sounds }`,
where `sounds` has the same shape as a shared mix. The preset modal can create,
rename, delete, and apply presets; applying calls `useSoundStore.override()` and
then starts playback.

## Categories and Favorites

`src/data/sounds.ts` currently exposes the visible categories: nature, rain,
animals, urban, places, transport, things, and noise. There is also a
`src/data/sounds/binaural.tsx` file, but it is not imported into the visible
catalog.

`App` computes a synthetic `Favorites` category when at least one sound has
`isFavorite`. Favorites preserve the order in which favorite IDs appear in the
sound store. The favorites category is marked `functional={false}`, so favorite
tiles mirror state but do not instantiate duplicate playable Howler instances.

Sound categories show the first six sounds by default. The expanded/collapsed
state is persisted per category with keys like `${categoryId}-show-more`. If a
hidden sound is selected, the "Show More" button gets an active style.

## Toolbar, Menus, and Modals

The toolbar contains scroll-to-top and the Radix dropdown menu. Menu state is
local to `src/components/toolbar/menu/menu.tsx`. Opening any tool closes the
dropdown, broadcasts `CLOSE_MODALS`, closes other local modals, then opens the
target modal/tool.

Keyboard shortcuts are registered with `react-hotkeys-hook`, including:

- `shift+m`: toggle menu.
- `shift+alt+p`: presets.
- `shift+h`: shortcuts.
- `shift+b`: breathing.
- `shift+n`: notepad.
- `shift+p`: Pomodoro.
- `shift+t`: todo.
- `shift+c`: countdown.
- `shift+g`: settings.
- `shift+s`: share link, only when sounds are selected.
- `shift+alt+t`: sleep timer.

The shared `Modal` component uses a portal, focus trap, escape-to-close, overlay
click close, body scroll locking, and animated overlay/content transitions.
`persist` keeps a modal mounted while hiding it, used by lofi YouTube embeds.

## Focus and Utility Tools

- Sleep timer: `SleepTimerModal` starts playback if needed, counts down, then
  dispatches `FADE_OUT` with a one-second duration. Its active flag is mirrored
  in `useSleepTimerStore`.
- Pomodoro: `Pomodoro` supports Pomodoro, short break, and long break tabs;
  durations are persisted in `moodist-pomodoro-setting`. Completion plays
  `/sounds/alarm.mp3` at `settings.alarmVolume`.
- Countdown: simple HH:MM:SS timer with pause/resume and alarm on completion.
- Todo: persisted list with add/edit/delete/toggle. When all todos are done,
  `addConfetti()` fires.
- Notepad: persisted plain text with word/character counters and one-level
  restore after clear.
- Breathing exercise: modal-guided breathing flow under
  `src/components/modals/breathing`.
- Binaural beat: Web Audio API creates left/right oscillators with stereo
  panning and a beat-frequency offset.
- Isochronic tone: Web Audio API creates a base oscillator modulated by a square
  wave gain oscillator.
- Lofi player: embeds predefined YouTube livestreams only after the user accepts
  the external-connection notice.

## Media Session Support

`MediaControls` checks for `navigator.mediaSession`. If available,
`MediaSessionTrack` plays a looping silent `/sounds/silence.wav` track while
Moodist X is playing so OS/browser media controls remain active. Media session
play/pause handlers call the sound store. Safari reloads the silent audio on
pause to avoid replay issues.

## PWA and Deployment

`astro.config.mjs` configures the PWA manifest and Workbox cache. The Workbox
setup caches all generated assets and raises `maximumFileSizeToCacheInBytes` to
`Number.MAX_SAFE_INTEGER`, which matters because sound files are large.

Docker builds with Node 20 Alpine, installs pnpm 10, runs `pnpm run build`, and
serves `dist` through Caddy. `docker-compose.yml` maps container port `8080`.

## Coding Conventions

- Use TypeScript, React function components, and CSS Modules for component
  styling.
- Use the `@/` path alias for imports from `src`.
- Keep persisted store reads browser-safe. Follow the existing
  `skipHydration + StoreConsumer.rehydrate()` pattern when adding persisted
  Zustand stores.
- Guard browser-only APIs with `useSSR().isBrowser`, effects, or event handlers.
  This applies to `window`, `document`, `localStorage`, `navigator`, `Howl`, and
  `AudioContext`.
- Keep sound IDs stable. IDs are persisted, used in shared URLs, and referenced
  by presets.
- Add new catalog sounds by placing audio under `public/sounds/<category>/` and
  adding metadata in the matching `src/data/sounds/*.tsx` file.
- Avoid creating duplicate Howler instances for mirrored or non-functional UI,
  following the favorites category pattern.
- Prefer existing helpers (`cn`, `dispatch`/`subscribe`, motion variants,
  `useLocalStorage`, `useSound`, `useSoundEffect`) over new ad hoc utilities.
- Keep Biome style: two spaces, single quotes, semicolons, trailing commas, and
  80-column formatting where practical.

## Validation Checklist

For most code changes:

```bash
pnpm run check
pnpm run build
```

For audio behavior changes, also run the app with:

```bash
pnpm run dev
```

Then manually verify selecting sounds, changing volume, global play/pause,
unselect all, share import, presets, and sleep-timer fade-out. Browser autoplay
policies mean sound playback must be tested after a user gesture.
