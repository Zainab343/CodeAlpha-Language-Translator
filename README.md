# Relay — Language Translation Tool

**CodeAlpha Artificial Intelligence Internship — Task 1**

A browser-based language translation tool. Type or speak text in one language and get an instant translation into another, with the option to copy the result or have it read aloud.

## Features

- Translate between 20 major languages
- Voice input (speech-to-text) using the Web Speech API
- Text-to-speech playback of the translated result
- One-click copy to clipboard
- Swap source/target languages instantly
- Recent-translations history (session-based)
- Fully responsive, keyboard-accessible, dark UI

## How it works

- **UI**: plain HTML/CSS/JS, no build step or framework required.
- **Translation**: calls the free [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php) (`api.mymemory.translated.net`) — no API key needed for casual/demo use.
- **Voice input/output**: uses the browser-native `SpeechRecognition` and `SpeechSynthesis` Web APIs (Chrome/Edge recommended for best support).

## Running it locally

No build tools needed — it's a static site.

1. Download/clone this folder.
2. Open `index.html` directly in a browser, **or** serve it locally for full mic support:
   ```bash
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## Project structure

```
CodeAlpha_LanguageTranslator/
├── index.html      # markup
├── style.css        # styling (dark theme, dual-accent design)
├── script.js         # translation logic, voice I/O, history
└── README.md
```

## Notes for submission

- Repo name follows the required convention: `CodeAlpha_LanguageTranslator`
- Remember to also: post your internship status on LinkedIn tagging @CodeAlpha, record a short video walkthrough with the GitHub link, and submit through the official form.

## Possible extensions

- Swap MyMemory for Google Cloud Translation / Microsoft Translator for higher accuracy and rate limits
- Add a language auto-detect option
- Persist history with `localStorage`
