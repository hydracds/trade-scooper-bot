# CDS Trade Scooper Bot

A TypeScript-based trading bot for the Cardano ecosystem, designed to monitor price discrepancies and execute arbitrage trades.

## Features

- **Real-time Monitoring**: Polls liquidity pool data across all Cardano DEXes at configurable intervals.
- **Arbitrage Detection**: Compares liquidity pool data across all Cardano DEXes (e.g., SundaeSwap, WingRiders, Minswap) to find profitable opportunities.
- **Automated Execution**: Executes trades when profit thresholds are met.
- **CSV Logging**: Logs probable trades to a CSV file for analysis.

## Prerequisites

- Node.js (v16 or higher)
- npm

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd cds-trade-scooper-bot
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

2.  Edit `.env` and configure the following variables:

    | Variable | Description | Default |
    | :--- | :--- | :--- |
    | `API_BASE_URL` | Base URL for the CDS API | `https://cardexscan.com/api/` |
    | `CDS_API_KEY` | API Key for CDS API Access | - |
    | `ASSET_POLICY_ID` | Policy ID of the asset to trade | - |
    | `ASSET_NAME_HEX` | Hex-encoded name of the asset | - |
    | `TICKER` | Ticker symbol of the asset (e.g., SNEK) | `SNEK` |
    | `POLLING_INTERVAL_MS` | Interval between price checks in ms | `5000` |
    | `PROFIT_THRESHOLD` | Minimum profit in ADA to trigger a trade | `20` |
    | `MIN_PRICE_DELTA_PERCENT` | Minimum price difference % to log/act | `1.0` |
    | `MNEMONIC` | Wallet mnemonic for signing transactions | - |
    | `LOG_DIR` | Directory for log files | `logs` |
    | `CSV_FILENAME` | Filename for trade logs | `probable_trades.csv` |
    | `NODE_ENV` | Environment (development/production) | `development` |

## Usage

### Development

Run the bot in development mode with hot-reloading:

```bash
npm run dev
```

### Production

Build and start the bot:

```bash
npm run build
npm start
```

## Project Structure

- `src/`
    - `index.ts`: Entry point.
    - `monitor.ts`: Core logic for monitoring prices and finding arbitrage.
    - `executor.ts`: Handles trade execution.
    - `api.ts`: API interaction helper.
    - `config.ts`: Configuration loader.
    - `logger.ts`: CSV logging utility.
    - `utils.ts`: Utility functions (sleep, retry, etc.).
    - `types.ts`: TypeScript type definitions.