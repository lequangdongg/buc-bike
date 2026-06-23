import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'https://www.buckbike.com/assets/images/';
// source filename -> semantic local name
const MAP = {
  'card-1.png': 'bike-evo-200-lite.png',
  'card-2.png': 'bike-feliz-s.png',
  'card-3.png': 'bike-theon.png',
  'card-4.png': 'feature-safety.png',
  'banner-wide.png': 'banner.png',
};

await mkdir('src/assets', { recursive: true });

for (const [remote, local] of Object.entries(MAP)) {
  try {
    const res = await fetch(BASE + remote);
    if (!res.ok) {
      console.warn('SKIP', remote, '->', res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(`src/assets/${local}`, buf);
    console.log('saved', local, buf.length, 'bytes');
  } catch (err) {
    console.warn('ERROR', remote, err.message);
  }
}
