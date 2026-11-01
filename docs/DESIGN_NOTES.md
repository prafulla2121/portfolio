# Design notes

The look is unchanged on purpose: the site keeps the template that the live site
(https://prafullapurohit.netlify.app/) already uses: same colours (#EA9010, #343D35, #FEF5E4),
same fonts (Roboto Flex + DM Serif Display), same layout and logo. Only motion was added on top,
and the colours and fonts can now be changed from /admin (Settings, Theme).

## References looked at (ideas only, no code or assets copied)

| Site | Idea taken |
| --- | --- |
| https://brittanychiang.com | Content first, motion stays quiet; projects as cards with tech tags and one clear link. |
| https://rauno.me | Small, precise micro-interactions; one short settle instead of many effects. |
| https://www.joshwcomeau.com/react/prefers-reduced-motion/ | Respect `prefers-reduced-motion`: motion is opt-in, transforms off for people who ask. |
| https://stripe.com/connect | Staggered reveal of related items so the eye reads them in order. |
| https://www.awwwards.com (developer portfolio and loading-animation galleries) | A short page loader and soft page transitions; keep both under a second. |

## What was used

- **Hero entrance:** pretitle, title and lead rise one after another; the photo scales in softly.
- **Scroll reveal:** each section appears once when it enters the screen. Per section the owner picks
  `none`, `fade`, `slide`, `scale` or `stagger` in /admin.
- **Project cards:** stagger in, small lift on hover (transform only).
- **Page transitions:** the old page fades out fast, the new one settles in.
- **Loader:** `none`, `fade` or `spinner`, chosen in /admin; never waits longer than about 1.2 s.

## Rules kept

- Library: `motion` only. Only `opacity` and `transform` are animated; never `transition: all`,
  never width/height/top/left.
- `prefers-reduced-motion`: transforms switch off (`MotionConfig reducedMotion="user"`), the loader just disappears.
  A global "animations off" switch in /admin turns everything off.
- Keyboard focus stays visible; no sideways scroll at phone width.
