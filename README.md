# Momen Kebersamaan

A shareable memory page with a persistent backend so the page state can be saved and shared via a public link.

## Features

- Memory/tribute landing page design
- Page state editor for title, intro, and closing text
- Hero and featured media support
- Shareable page links using `?page=<id>`
- Server-side persistence in `data/pages.json`

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open the app in a browser:
   ```text
   http://localhost:3000
   ```

## Share flow

- Open the page normally.
- Click the Edit button.
- Change the text or media you want.
- Click Save.
- A shareable page URL will be generated and can be opened in another browser.

## Storage

The app saves page state in:

```text
data/pages.json
```

## Notes

This version is suitable for a local or hosted Node server. For a production public deployment, it is recommended to move the storage to a managed database such as Supabase, Firebase, or PostgreSQL.
