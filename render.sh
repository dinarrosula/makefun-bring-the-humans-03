#!/bin/bash
# render.sh — renders assets/ad.mp4 (1080x1920, 15s, 30fps) from this
# repository's assets. Follows https://make.fun/press/llms.txt (referral end
# card recipe) and the press manifest: brand badge 9:16 from frame 0 until
# the end card, referral end card over the last 2.5 s with the clip blurred
# (sigma 28) and desaturated (0.35) fading in over 0.8 s, referral code typed
# in after the field rests (1.433 s into the card).
# Inputs: assets/background.mp4 (original generated clip, 720x1280, 10 s,
# looped), press-kit brand badge + referral card (used as-is, never altered),
# press-kit ghost illustration (used as-is).
# Fonts: DejaVu Sans Bold (on-screen text), DejaVu Sans Mono Bold (referral
# code — JetBrains Mono / Inter are not installed on this machine).
# Usage: bash render.sh   (outputs assets/ad.mp4)
set -euo pipefail
cd "$(dirname "$0")"

BG=assets/background.mp4
CARD=press-kit/referral-card/9x16/makefun-card-9x16-transparent.webm
BADGE=press-kit/brand-badge/9x16/makefun-badge-9x16.png
GHOST=press-kit/illustrations/ghost-pile-trophy.png
CODE=eaw3sp0q
OUT=assets/ad.mp4

ffmpeg -y -stream_loop 1 -t 15 -i "$BG" \
  -c:v libvpx-vp9 -i "$CARD" \
  -i "$BADGE" -i "$GHOST" \
  -filter_complex_script assets/render-filter.txt \
  -map '[v]' -an -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart "$OUT"
echo "wrote $OUT"
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration,codec_name \
  -of default=noprint_wrappers=1 "$OUT"
