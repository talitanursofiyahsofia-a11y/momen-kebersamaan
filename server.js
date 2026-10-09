const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'pages.json');

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
}

function readPages() {
  ensureDirs();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (error) {
    return {};
  }
}

function writePages(pages) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(pages, null, 2), 'utf8');
}

function defaultState() {
  return {
    siteTitle: 'MOMENTARY',
    siteSubtitle: 'Jejak Kebersamaan Kita',
    heroTitle: 'Bersama <span class="ital">dalam</span> cerita',
    heroText: 'Kenangan indah yang kita lukis bersama, tak pernah hilang walau waktu berganti.',
    introTitle: 'Kehidupan <span class="ital">yang menyatukan</span> kita',
    introText: 'Setiap momen yang kita lalui bersama membuat kami lebih berarti. Dari tawa hingga haru, semuanya menjadi bagian dari cerita yang tak tergantikan.',
    soundtrackText: 'Lirik-lirik sederhana ini menjadi pengiring perjalanan kita, menenangkan dan menghangatkan hati ketika rindu datang.',
    closingTitle: 'FOREVER',
    closingText: 'Semua cerita hari ini adalah bagian dari perjalanan kita. Terima kasih sudah menjadi tempat pulang yang hangat dan penuh arti.',
    featuredMeta: 'Momen indah',
    heroMedia: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80'
    },
    featuredMedia: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80'
    },
    gallery: [
      { label: 'Sunset', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
      { label: 'Smile', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
      { label: 'Together', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80' },
      { label: 'Joy', src: 'https://images.unsplash.com/photo-1529154691717-3306083d869e?auto=format&fit=crop&w=900&q=80' },
      { label: 'Run', src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80' },
      { label: 'Grin', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80' }
    ],
    videos: [
      { label: 'Moment 1', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
      { label: 'Moment 2', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm' }
    ],
    timeline: [
      { time: 'Januari 2024', title: 'Awal perjumpaan', desc: 'Sebuah kenangan dimulai dari percakapan sederhana yang tak pernah lupa.' },
      { time: 'Maret 2024', title: 'Luka dan tawa', desc: 'Hari-hari yang penuh semangat, cerita ringan, dan senyum yang tak pernah padam.' },
      { time: 'Juni 2024', title: 'Bertumbuh bersama', desc: 'Kita belajar, menangis, tertawa, dan saling menjaga dengan cara yang unik.' }
    ],
    memoryWall: [
      'https://images.unsplash.com/photo-1529154691717-3306083d869e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ]
  };
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.static(ROOT));
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'service is running' });
});

app.get('/api/page/:id', (req, res) => {
  const pages = readPages();
  const page = pages[req.params.id];
  if (!page) {
    return res.status(404).json({ ok: false, error: 'page not found' });
  }

  res.json({ ok: true, page: { id: page.id, state: page.state } });
});

app.post('/api/page', (req, res) => {
  const pages = readPages();
  const id = crypto.randomUUID();
  const state = req.body?.state || defaultState();
  const entry = { id, state, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  pages[id] = entry;
  writePages(pages);

  const shareUrl = `${req.protocol}://${req.get('host')}/?page=${id}`;
  res.json({ ok: true, page: { id, state }, shareUrl });
});

app.post('/api/page/:id', (req, res) => {
  const pages = readPages();
  const existing = pages[req.params.id];
  if (!existing) {
    return res.status(404).json({ ok: false, error: 'page not found' });
  }

  const state = req.body?.state || existing.state || defaultState();
  existing.state = state;
  existing.updatedAt = new Date().toISOString();
  pages[req.params.id] = existing;
  writePages(pages);

  const shareUrl = `${req.protocol}://${req.get('host')}/?page=${req.params.id}`;
  res.json({ ok: true, page: { id: req.params.id, state }, shareUrl });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'no file provided' });
    }

    const ext = req.file.mimetype.startsWith('image/') ? '.webp' : '.mp4';
    const filename = `${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    if (req.file.mimetype.startsWith('image/')) {
      await sharp(req.file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);
    } else {
      fs.writeFileSync(filepath, req.file.buffer);
    }

    const url = `/uploads/${filename}`;
    res.json({ ok: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/admin/pages', (req, res) => {
  const pages = readPages();
  const list = Object.values(pages).map((p) => ({
    id: p.id,
    title: p.state?.siteTitle || 'Untitled',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  }));
  res.json({ ok: true, pages: list });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(ROOT, 'index.html'));
});

ensureDirs();
app.listen(PORT, () => {
  console.log(`\n🎉 Momentary backend running on http://localhost:${PORT}\n`);
  console.log(`Admin page: http://localhost:${PORT}/admin.html\n`);
});
