import axios from 'axios';
import cfg from './config';
import { Signal } from './types';


export async function executeTrade(signal: Signal): Promise<any> {
// basic safety
if (Math.abs(signal.deltaPercent) > 50) {
throw new Error('Delta too large, aborting automated execution');
}


const payload = {
    wallet: cfg.tradingWalletAddress,
    asset: {
        policyId: cfg.assetPolicyId,
        assetNameHex: cfg.assetNameHex
    },
    side: signal.deltaPercent > 0 ? 'SELL' : 'BUY',
    price: signal.price,
    size: 'AUTO'
};


if (!cfg.tradingApiUrl) {
return { status: 'dry-run', payload };
}


const res = await axios.post(cfg.tradingApiUrl, payload, {
headers: { Authorization: `Bearer ${cfg.tradingApiKey ?? ''}` },
timeout: 10000
});


return res.data;
}