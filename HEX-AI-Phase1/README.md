# HEX AI — Phase 1

A futuristic dark AI chat application using Node.js, Express and the official OpenAI JavaScript SDK.

## Requirements
- Node.js 20 or newer
- npm
- An OpenAI API key with API billing/credits enabled

## Setup (Windows / VS Code)
1. Extract the ZIP.
2. Open the extracted `HEX-AI-Phase1` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run `npm install`.
5. Copy `.env.example` and rename the copy to `.env`.
   - In PowerShell: `Copy-Item .env.example .env`
6. Open `.env` and replace `put_your_api_key_here` with your API key.
7. Save the file.
8. Run `npm run dev`.
9. Open `http://localhost:3000` in your browser.

## Important security notes
- Never put your API key in frontend JavaScript or commit `.env` to GitHub.
- `.env` is excluded by `.gitignore`.
- Phase 1 is a local development prototype, not ready for public users.
- Chat messages are not saved to a database yet. Phase 2 adds PostgreSQL conversation storage; later phases add authentication and per-user memory.
- Before public deployment, add authentication, CSRF/origin protections as appropriate, robust request quotas, abuse monitoring, privacy disclosures, and database access controls.

## Troubleshooting
- `OPENAI_API_KEY is missing`: check that `.env` exists in the project root and the key is set.
- `401`: the API key may be invalid or revoked.
- `429`: check API billing, limits, or rate limits.
- `model_not_found`: set `OPENAI_MODEL` in `.env` to a model enabled for your API project.
- `npm is not recognized`: install Node.js LTS, then close and reopen VS Code.

## Phase 1 scope
- Futuristic HEX AI interface
- Express backend
- OpenAI Responses API integration
- Basic rate limiting and input validation
- Health-check endpoint
- No login, persistent history, or long-term memory yet
