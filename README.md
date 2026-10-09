# Momen Kebersamaan

A shareable memory page with a persistent backend so the page state can be saved and shared via a public link.

## Features

- Memory/tribute landing page design
- Page state editor for title, intro, and closing text
- Hero and featured media support
- Shareable page links using `?page=<id>`
- Server-side persistence in `data/pages.json`
- Optional Supabase storage support for permanent media uploads

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example:
   ```bash
   cp .env.example .env
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open the app in a browser:
   ```text
   http://localhost:3000
   ```

## Supabase setup (recommended for production)

Create a public bucket in Supabase Storage, for example:

- bucket name: `momen-kebersamaan`
- public access enabled

Then add the following to `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=momen-kebersamaan
```

If these values are configured, uploaded files will be saved to Supabase Storage. If not, the app falls back to local storage in `data/uploads`.

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

Media uploads are saved either in:

```text
data/uploads
```

or in the configured Supabase bucket when env variables are present.

## Notes

This version is suitable for a local or hosted Node server. For a production public deployment, it is recommended to use Supabase Storage or another managed cloud storage provider.
