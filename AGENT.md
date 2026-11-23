# bring-the-humans-03 — build notes

Entry for make.fun's "Bring the humans with a TikTok ad" bounty ($500, top 20
share by views). Account: @ace. TikTok account for the post: @acecarace3
(public, Don posts the video himself — the agent never logs in to TikTok).

## The ad (assets/ad.mp4 — 1080x1920, 15 s, 30 fps, H.264)

Creative, decided in the recorded session: a dark stage with magenta light
ribbons (an original generated clip), make.fun's brand badge top-left from
frame 0, four text beats, then the referral end card.

- 0–2.5 s — hook: "YOUR AI AGENT / COULD BE GETTING PAID." + the press pack's
  ghost-pile-trophy illustration.
- 2.5–6 s — what make.fun is: "make.fun is where / AI AGENTS COMPETE /
  in bounties for / REAL MONEY." + "Humans join through their agent."
- 6–10 s — why join: "AGENTS BUILD. / WINNERS TAKE / REAL USDC." +
  "$500 in prizes for this ad."
- 10–12.5 s — call to action: "ENTER YOUR AI AGENT / IN A BOUNTY ON /
  make.fun"
- 12.5–15 s — make.fun's referral end card (press pack, used as-is) with
  referral code `eaw3sp0q` typed into its field; the clip underneath blurs
  (sigma 28) and desaturates (0.35), fading in over 0.8 s, per the press
  pack's own ffmpeg recipe.

Brand files come from https://make.fun/press/manifest.json (edition
2026-11-21) and are used as-is, never redrawn or recoloured: brand badge
9:16, referral end card 9:16 (transparent webm), ghost-pile-trophy. On-screen
text is DejaVu Sans Bold; the referral code is DejaVu Sans Mono Bold
(JetBrains Mono / Inter are not installed on the build machine).

## Files

- `main.ts` — entrypoint (Node 22, stdlib only): validates VIDEO.json,
  copies it and `assets/ad.mp4` to the output directory. No network, no
  clock, no files outside the repository; two runs write the same bytes.
- `VIDEO.json` — the posted TikTok video's address. Placeholder until the
  video is posted from @acecarace3; the gate refuses the placeholder.
- `render.sh` + `assets/render-filter.txt` — the exact ffmpeg build that
  produced `assets/ad.mp4` from `assets/background.mp4` and the press files.
- `assets/background.mp4` — the original generated background clip
  (720x1280, 10 s, looped to 15 s in the render). Generated in the recorded
  session with the video tool, after the repository existed (second
  generation; the first clip is kept outside the repo as a backup). The
  rendered ad's sha256 is
  `b4a62f5605e06256d0937122dce2b315705f49a63f8410b9cb48f9325bfa8d09`.
- `press-kit/` — the press files used, as downloaded.

## TikTok caption (exact)

    Made by my AI agent for a $500 bounty on make.fun, where AI agents compete for real money: make.fun/bounty/bring-the-humans-03

Plus the play code `makefun-hermit-mask-dust` in the caption (or the
account bio), and the referral link https://make.fun/r/eaw3sp0q after the
line. (Play code = @ace's account play code, verified live 23 Nov in
/api/me; the competition description asks for "your make.fun play code".
CORRECTION 23 Nov ~10:40 WIB: the builder's claim of per-competition
codes `makefun-goblet-eclipse-toucan` etc. is UNVERIFIED — absent from the
competition JSON, absent from /api/me, no play-codes endpoint exists.
Do NOT use the goblet code.)
Post the video publicly from @acecarace3, keep it public until the results
are out, then put its full address
(`https://www.tiktok.com/@acecarace3/video/<digits>`) in VIDEO.json and
submit before the deadline (2026-11-24T19:00:00Z).
