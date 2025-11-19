import EventEmitter from 'events';
import { Signal, Asset } from './types';
import { getSwapEstimate, executeTrade } from './api';
import cfg from './config';
import { lovelaceToAda, sleep } from './utils';

export declare interface Monitor {
    on(event: 'price', listener: (p: { timestamp: string; price: number }) => void): this;
    on(event: 'signal', listener: (s: Signal) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
}

export class Monitor extends EventEmitter {
    private timer: NodeJS.Timeout | null = null;
    private running = false;

    constructor() {
        super();
    }

    public async start(config: any) {
        if (this.running) return;
        this.running = true;
        while (this.running) {
            await this.tick(config);
            await sleep(10000);
        }
    }


    public stop() {
        this.running = false;
        if (this.timer) clearTimeout(this.timer);
    }


    private async tick(config: any) {
        try {

            console.log('Monitor started with config:', config);

            const data = await this.compareLPsForArbitrageCDS(config);

            // console.table(data);
            const pData = data.sort((a, b) => b.profitintokena - a.profitintokena);
            // console.table(pData);
            const meanTrade = pData.filter(d => d.profitintokena >= cfg.profitThreshold);
            if (meanTrade && meanTrade.length > 0) {
                const { tokenain, tokenbpolicyid, tokenbhex, tokenbdecimals, tokenbticker, tokenbout, tokenaout, dexesA, dexesB } = meanTrade[0];
                const involvedDexes = [...dexesA, ...dexesB];
                if (!involvedDexes.includes("VYFINANCE") && !involvedDexes.includes("VyFinance")) {
                    // Running the front running code.
                    executeTrade({
                        "tokenain": tokenain,
                        "slippage": 2,
                        "tokenIn": "lovelace",
                        "tokenOut": {
                            "policyId": tokenbpolicyid,
                            "nameHex": tokenbhex,
                            "decimals": tokenbdecimals,
                            "verified": true,
                            "ticker": tokenbticker
                        },
                        "blacklisted_dexes": [
                            "CERRA",
                            "GENIUS",
                            "TEDDYSWAP",
                            "SPECTRUM"
                        ],
                        "tokenbout": tokenbout,
                        "tokenaout": tokenaout
                    }).catch((e: any) => {
                        // isRunning = false;
                    }).finally(() => {
                        // isRunning = false;
                    });
                }
            }
        } catch (e) { }
    }

    async compareLPsForArbitrageCDS(t: any): Promise<any[]> {
        let data = [];
        const token: Asset = new Asset(t.policyId, t.assetName, t.decimals, true, t.ticker);
        const swapAmounts = Array.from({ length: 3 }, (_, i) => (i + 1) * 80); // [80, 160, ..., 800]
        console.log(`Getting swap estimates for ${t.ticker} with amounts ${swapAmounts}`);

        const tokenData: any[] = await Promise.all(
            swapAmounts.map(amount =>
                this.compareLPWithCDSSwapEstimate(amount, token, true, true, 2)
            )
        );
        const profitableResults = tokenData.filter(t => t?.profitintokena > 1);
        if (profitableResults && profitableResults.length) {
            data.push(...profitableResults);
        }

        return data;
    }

    async compareLPWithCDSSwapEstimate(d: number, t: Asset, log: boolean = true, objectType: boolean = false, margin = 1) {
        let msg = "";
        if (log) console.log(`Getting swap estimates for ${t.ticker} with amount ${d}`);

        const a = await getSwapEstimate({ tokenInAmount: d, tokenIn: "lovelace", tokenOut: t, slippage: 1, blacklisted_dexes: ["CERRA", "GENIUS", "TEDDYSWAP", "SPECTRUM"] });
        if (!a) {
            if (log) console.error(`#1 Swap Estimate failed for ${t.ticker}`);
            return objectType ? { msg: "" } : msg;
        }
        const b = await getSwapEstimate({ tokenInAmount: a?.data?.estimatedTotalRecieve, tokenIn: t, tokenOut: "lovelace", slippage: 1, blacklisted_dexes: ["CERRA", "GENIUS", "TEDDYSWAP", "SPECTRUM"] });
        if (!b) {
            if (log) console.error(`#2 Swap Estimate failed for ${t.ticker}`);
            return objectType ? { msg: "" } : msg;
        }
        // const output = `${t.ticker}->ADA ${a?.data?.splits[0].dex} @ ${a.data.total_input} -> ${b?.data?.splits[0].dex} @ ${b.data.estimatedTotalRecieve} \n`;
        const output = `ADA -> ${t.ticker} on Dex: ${a?.data?.splits.map((d: any) => d.dex).join(", ")}\n${t.ticker} recieved: ${a.data.estimatedTotalRecieve}\n${t.ticker} -> ADA on Dex: ${b?.data?.splits.map((d: any) => d.dex).join(", ")}\nADA Involved: ${d} -> ${lovelaceToAda(b.data.estimatedTotalRecieve)}\nPolicy Id: ${t.policyId} \n\n ------------- \n`;
        if (log) console.log(output);
        if (d < lovelaceToAda(b.data.estimatedTotalRecieve) && (lovelaceToAda(b.data.estimatedTotalRecieve) - d) > margin) {
            console.log(output);
            msg += output;
        }
        // console.log(chalk.green(output));
        return objectType ? {
            id: `${t.ticker}_${d}`,
            tokenapolicyid: '', // ADA Policy ID
            tokenahex: '',
            tokenbpolicyid: t.policyId, // token Policy ID
            tokenbhex: t.nameHex,
            tokenbticker: t.ticker,
            tokenbdecimals: t.decimals,
            tokenain: d,
            tokenbout: a.data.estimatedTotalRecieve,
            tokenaout: lovelaceToAda(b.data.estimatedTotalRecieve),
            dexesA: a?.data && a?.data?.splits ? a?.data?.splits.map((d: any) => d.dex) : [],
            dexesB: b?.data && b?.data?.splits ? b?.data?.splits.map((d: any) => d.dex) : [],
            profitintokena: Number(b.data.estimatedTotalRecieve - d)
        } : msg;
    }
}