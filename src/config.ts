import path from 'path';
import dotenv from 'dotenv';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });


export interface Config {
    baseUrl?: string;
    apiKey?: string;
    assetPolicyId?: string;
    assetNameHex?: string;
    pollingIntervalMs: number;
    minPriceDeltaPercent: number;
    tradingApiUrl?: string;
    tradingApiKey?: string;
    tradingWalletAddress?: string;
    logDir: string;
    csvFilename: string;
    profitThreshold: number;
    dryRun?: boolean
}


const cfg: Config = {
    baseUrl: process.env.API_BASE_URL,
    apiKey: process.env.CDS_API_KEY,
    assetPolicyId: process.env.ASSET_POLICY_ID,
    assetNameHex: process.env.ASSET_NAME_HEX,
    pollingIntervalMs: Number(process.env.POLLING_INTERVAL_MS ?? 5000),
    minPriceDeltaPercent: Number(process.env.MIN_PRICE_DELTA_PERCENT ?? 1.0),
    tradingApiUrl: process.env.TRADING_API_URL,
    tradingApiKey: process.env.TRADING_API_KEY,
    tradingWalletAddress: process.env.TRADING_WALLET_ADDRESS,
    logDir: process.env.LOG_DIR ?? 'logs',
    csvFilename: process.env.CSV_FILENAME ?? 'probable_trades.csv',
    profitThreshold: Number(process.env.PROFIT_THRESHOLD ?? 20),
    dryRun: process.env.DRY_RUN === 'true'
};


export default cfg;