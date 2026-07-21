# Release notify

Sends a "新版本上線" email to every registered Firebase Auth user. Run automatically
by [`.github/workflows/deploy-stocks-frontend.yml`](../../../.github/workflows/deploy-stocks-frontend.yml)
right after the frontend is deployed to Firebase Hosting.

## One-time setup (GitHub repo settings)

1. **Firebase service account** (used both to deploy Hosting and to list user emails via
   Admin SDK):
   - Firebase Console → your `stocks-global` project → ⚙️ Project settings → **Service accounts**
     → **Generate new private key** → downloads a JSON file.
   - In Google Cloud Console → IAM, make sure that service account has both
     **Firebase Hosting Admin** and **Firebase Authentication Admin** roles (the default key
     from the Firebase console usually already has enough access; add the Auth Admin role if
     `listUsers()` fails with a permission error).
   - GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
     → name it `FIREBASE_SERVICE_ACCOUNT`, paste the entire JSON file content as the value.

2. **Resend account** (email delivery):
   - Sign up at resend.com, create an API key.
   - Add secret `RESEND_API_KEY` with that key.
   - Optional: add a repository **variable** (not secret) `RESEND_FROM` if you verify your own
     sending domain in Resend, e.g. `notify@yourdomain.com`. If you skip this, emails are sent
     from Resend's shared `onboarding@resend.dev` address, which works without any domain setup.

That's it — no code changes needed after secrets are in place.

## What triggers it

- Any push to `main` that touches `Stocks/frontend/**` → build → deploy to Firebase Hosting →
  email all users.
- Or manually: GitHub → Actions → "Deploy Stocks Frontend" → **Run workflow**, optionally typing
  a custom release note (otherwise it uses the latest commit's message).

## Local testing

```bash
cd Stocks/scripts/release-notify
npm install
FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /path/to/serviceAccount.json)" \
RESEND_API_KEY=re_xxx \
RELEASE_VERSION=test \
RELEASE_NOTE="testing" \
node notify.mjs
```
