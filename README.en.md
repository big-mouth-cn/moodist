<div align="center">
  <img src="/public/og.png" alt="Moodist X" />
  <h2>Moodist X</h2>
  <p>An AI-powered ambient sound mixer for focus, rest, and calm.</p>
  <p>
    <a href="https://moodistx.aigateway.cn">Visit <strong>Moodist X</strong></a>
    ·
    <a href="README.md">中文 README</a>
  </p>
</div>

---

## Highlights

### AI Soundscape Creation

Moodist X lets users describe any scene, mood, or environment in natural language, for example:

- “A rainy night cafe for focused writing”
- “A calm forest cabin for falling asleep”
- “A morning office with subtle voices and keyboard sounds”

The app calls an OpenAI Chat Completions-compatible LLM API, selects sounds from the built-in catalog, and returns a playable mix with volume settings. Generated records are saved locally in the browser and can be reapplied later from the AI modal history.

### Multilingual Support

Currently supported:

- English
- Simplified Chinese

Users can switch languages in Settings, and the choice is saved locally in the browser. Page title, main UI text, menus, modals, and sound names follow the selected language.

## Features

- 84 curated ambient sounds that can be layered freely.
- AI soundscape creation: enter a scene description and generate a playable mix.
- AI generation history: saved locally in the browser and available for reuse.
- English and Simplified Chinese support, with local language persistence.
- Per-sound volume control.
- Favorite sounds.
- Random sound mixes.
- Shareable mix links with one-click import.
- Presets for saving, renaming, deleting, and quickly applying mixes.
- Built-in binaural beat and isochronic tone generators.
- Built-in breathing exercise, Pomodoro, countdown, todo list, and notepad.
- Installable PWA with offline caching.
- Docker-based self-hosting.

## AI Configuration

The AI generation feature connects directly from the frontend to an OpenAI Chat Completions-compatible API through public environment variables:

```bash
PUBLIC_LLM_BASE_URL=https://api.openai.com/v1
PUBLIC_LLM_API_KEY=your_api_key
PUBLIC_LLM_MODEL=gpt-4o-mini
```

Request endpoint:

```text
${PUBLIC_LLM_BASE_URL}/chat/completions
```

Note: this frontend-direct approach exposes `PUBLIC_LLM_API_KEY` to browser users. For production deployments that need to hide the key, add a backend proxy.

## Local Development

```bash
pnpm install
pnpm run dev
```

Build:

```bash
pnpm run build
```

Check:

```bash
pnpm run check
```

## Self-Hosting

### Docker

```bash
docker run -d \
  --name moodist \
  -p 8080:8080 \
  ghcr.io/remvze/moodist:latest
```

Then open:

```text
http://localhost:8080
```

### Docker Compose

The project root includes `docker-compose.yml`:

```bash
docker compose up -d
```

Then open:

```text
http://localhost:8080
```

## Open Source

Current project repository:

- [big-mouth-cn/moodist](https://github.com/big-mouth-cn/moodist)

Moodist X is built as a secondary development based on the open-source project [remvze/moodist](https://github.com/remvze/moodist) and follows the MIT License.

## License

This project is open source under the **MIT License**. See [LICENSE](LICENSE) for details.

### Third-Party Audio Assets

Some audio assets used in this project are provided by third-party sources and may be subject to different licenses:

- Pixabay Content License: [Pixabay Content License](https://pixabay.com/service/license-summary/)
- CC0: [Creative Commons Zero License](https://creativecommons.org/publicdomain/zero/1.0/)
