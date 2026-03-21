# Market W.I.P

Realtime stock news platform with:

- User login/signup and persistent wishlist
- Admin-only news publishing, editing, and deleting
- Realtime news feed updates
- Email notifications when a post matches wishlist tag

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill all Firebase keys
3. Fill `NEXT_PUBLIC_ADMIN_EMAILS`
4. Fill `IMGBB_API_KEY`
5. Fill SMTP variables:
	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_SECURE`
	- `SMTP_USER`
	- `SMTP_PASS`
	- `EMAIL_FROM`
6. Set `NEXT_PUBLIC_SITE_URL` (used in email deep link)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Firestore Rules

Deploy rules after login to Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## Email Notification Flow

1. User signs up/logs in and adds wishlist tags.
2. Admin publishes a post with a matching stock tag.
3. Backend route sends email to all matched user email addresses.

## Verification Checklist

1. Create user account and add wishlist tag.
2. Add one wishlist tag (example: `RELIANCE`).
3. Login as admin and publish `RELIANCE` post.
4. Confirm user receives email notification.
