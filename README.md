# cds-trade-scooper-bot (TypeScript)


## Quickstart
1. Copy `.env.example` to `.env` and fill values.
2. npm install
3. npm run build
4. npm run start


For development:
1. npm install
2. npm run dev


## Notes
- The executor is a stub. Replace with real DEX/wallet integration.
- The monitor expects a price REST API; adapt `fetchPrice()` to your provider.
- CSV logs are appended to `logs/${cfg.csvFilename}`.

## Implementation Plan
### Goal Description
Setup and run the `cds-trade-scooper-bot` project. This involves configuring environment variables, installing dependencies, building the TypeScript code, and executing the start script.

### User Review Required
- **Environment Variables**: The `.env` file will be created with default values from `.env.example`. The user may need to update `ASSET_POLICY_ID`, `ASSET_NAME_HEX`, `TRADING_API_KEY`, etc., with actual values for the bot to function correctly.

### Proposed Changes
#### Configuration
- **.env**: Copy content from `.env.example`.

#### Dependencies
- **ts-node**: Install `ts-node` as a dev dependency to support `nodemon` execution.

### Verification Plan
#### Automated Tests
- Run `npm install` to ensure dependencies are installed.
- Run `npm run build` to verify the project compiles without errors.
- Run `npm start` to check if the bot starts up.
- Run `npm run dev` to verify `ts-node` execution.