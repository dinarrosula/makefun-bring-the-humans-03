// bring-the-humans-03 — entrypoint (Node 22, standard library only).
//
// What this program does, in order:
//   1. Reads VIDEO.json from the repository root and checks it parses and
//      names a URL. A TikTok video address looks like
//      https://www.tiktok.com/@<handle>/video/<digits>; anything else (the
//      starter placeholder included) is copied as-is but flagged on stderr,
//      because the gate, not this program, is what refuses a bad address.
//   2. Copies VIDEO.json to the output directory, where the gate reads it.
//   3. Stages the rendered ad itself, assets/ad.mp4, next to it, so the
//      output holds both the video's address and the video file. The report
//      printed at the end names each staged file with its byte size and
//      sha256, so two runs can be compared byte for byte.
// The ad was rendered in the recorded session from this repository's own
// assets (see render.sh): an original generated background clip, make.fun's
// brand badge and referral end card from the press pack (used as-is), the
// ghost illustration, and on-screen text laid out by ffmpeg. Nothing here
// touches the network, the clock, or any file outside the repository, so
// two runs write the same bytes.
//
// Run it locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const TIKTOK_VIDEO = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;

function fail(message: string): never {
  console.error(`bring-the-humans-03: ${message}`);
  process.exit(1);
}

function stage(relativePath: string): { size: number; sha256: string } {
  const source = join(BOT_DIR, relativePath);
  const target = join(OUTPUT_DIR, relativePath);
  mkdirSync(join(OUTPUT_DIR, 'assets'), { recursive: true });
  try {
    copyFileSync(source, target);
  } catch (err) {
    fail(`could not copy ${relativePath} from ${BOT_DIR}: ${(err as Error).message}`);
  }
  const bytes = readFileSync(target);
  return { size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
}

// 1. Read and sanity-check VIDEO.json.
let video: unknown;
try {
  video = JSON.parse(readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8'));
} catch (err) {
  fail(`VIDEO.json could not be read or parsed: ${(err as Error).message}`);
}
if (typeof video !== 'object' || video === null || typeof (video as { url?: unknown }).url !== 'string') {
  fail('VIDEO.json must be an object with a string "url" field');
}
const url = (video as { url: string }).url;
if (!TIKTOK_VIDEO.test(url)) {
  console.error(
    `warning: VIDEO.json does not name a TikTok video address yet (${url}); ` +
      'the gate will refuse this entry until it names the posted video',
  );
}

// 2 + 3. Stage VIDEO.json and the rendered ad.
mkdirSync(OUTPUT_DIR, { recursive: true });
const videoStaged = stage('VIDEO.json');
const adStaged = stage(join('assets', 'ad.mp4'));

console.log(`VIDEO.json (${videoStaged.size} bytes, sha256 ${videoStaged.sha256}) -> ${join(OUTPUT_DIR, 'VIDEO.json')}`);
console.log(`assets/ad.mp4 (${adStaged.size} bytes, sha256 ${adStaged.sha256}) -> ${join(OUTPUT_DIR, 'assets', 'ad.mp4')}`);
console.log(`video: ${url}`);
