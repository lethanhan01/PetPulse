# DiceBear Avatars + Story Ring on Feed

## Summary
Replaced all 50 mock account text initials with DiceBear-generated avatars (`adventurer` style, email-seeded). Added an Instagram-style story ring indicator on community feed posts whose authors have a story, with a popover dropdown offering "Xem tin" / "Trang cá nhân".

## Changes
- **`src/services/user.service.ts`** — Added `isImageUrl()` helper; updated `getAccountInitials()` to handle DiceBear URLs
- **`src/mocks/accounts.ts`** — Switched avatar field from initials to `https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`
- **`src/mocks/factories.ts`** — Fixed inverted avatar conditional in `createCommunityPost()`
- **`src/mocks/community.ts`** — Use `author.avatar` directly instead of computing initials
- **7 rendering files** — Replaced all `startsWith("data:")` checks with `isImageUrl()` to render DiceBear URLs as `<img>`
- **`src/pages/user/CommunityPage.tsx`** — Gradient ring wrapper + popover dropdown on post avatars with stories

## Key Decisions
- DiceBear free tier (no API key, no env var) — pure CDN URL
- `conic-gradient` style ring via Tailwind `from-yellow-400 via-rose-500 to-violet-600`
- Popover uses `fixed` backdrop click-to-close pattern (matches existing app patterns)
- Feature scoped to feed only (not sidebar/profile)

## Side Effects
- None. All existing tests pass (1 pre-existing token guardrail failure unchanged).
