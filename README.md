# RSP Gov.Notify Serverless API

Orchestrates sending notification messages via Gov.Notify.

## Run locally
Requires Node `^24.15.0` and npm `^11.12.1` (see `engines` in `package.json` and `.nvmrc`).

```bash
nvm use
npm i
npm start
```
Once running, send a `POST` request to one of:
- `http://localhost:3000/dev/notifyEmail` (body schema: [NotifyEmailRequest](src/models/NotifyEmailRequest.json))
- `http://localhost:3000/dev/notifySms` (body schema: [NotifySmsRequest](src/models/NotifySmsRequest.json))

The local server runs with `--noAuth`, so no authentication is required (in Bruno, set Auth to "No Auth").

## Configuration
Set in `.env` (loaded by `serverless-dotenv-plugin`):

| Variable | Description                                                                                     |
|---|-------------------------------------------------------------------------------------------------|
| `NOTIFY_API_KEY` | Gov.Notify API key                                                                              |
| `PAYMENT_PORTAL_URL` | URL included in messages                                                                        |
| `TEMPLATE_KEY_EMAIL_<LANGUAGE>`, `TEMPLATE_KEY_SMS_<LANGUAGE>` | Gov.Notify template IDs, e.g. `TEMPLATE_KEY_EMAIL_ENGLISH` (full list in `src/utils/config.js`) |
| `USE_SECRETS_MANAGER` | `true` to load config from Secrets Manager instead of env vars                                  |
| `SECRETS_MANAGER_SECRET_NAME`, `REGION` | Secret name and AWS region (Secrets Manager only)                                               |
| `AWS_PROFILE` | Optional profile for Secrets Manager when offline; defaults to the `default` profile            |

### Interacting with Secrets Manager locally
1. Sign in with a named profile:
   ```bash
   aws login --profile <name>          
   aws sts get-caller-identity --profile <name>
   ```
2. Check you can read the secret:
   ```bash
   aws secretsmanager get-secret-value --secret-id <secret-name> --region <region> --profile <name>
   ```
3. In `.env` set `USE_SECRETS_MANAGER=true`, `SECRETS_MANAGER_SECRET_NAME`, `REGION` and `AWS_PROFILE=<name>`, then run `npm start`.


## Scripts
- `npm test` / `npm run lint` / `npm run lint:fix`
- `npm run build` - bundles lambdas to `.webpack/`
- `npm run build:prod` - zips each lambda in `lambdas.json` into `dist/`

Serverless is used only for local running (`serverless-offline`) and OpenAPI generation (`npm run build-openapi`).
