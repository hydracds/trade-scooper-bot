import { Monitor } from './monitor';
import { logProbableTrade } from './logger';
import { executeTrade } from './executor';
import winston from 'winston';
import cfg from './config';


const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console({ format: winston.format.simple() })]
});


async function main() {

    const monitor = new Monitor();


    monitor.on('price', p => {
        logger.info(`price update ${p.price} @ ${p.timestamp}`);
    });


    monitor.on('signal', async (signal) => {
        logger.info(`signal detected: ${signal.deltaPercent.toFixed(3)}% - price ${signal.price}`);

        await logProbableTrade(signal, 'PROBABLE');

        try {
            const result = await executeTrade(signal);
            logger.info('execution result: ' + JSON.stringify(result));
            await logProbableTrade(signal, result?.status ?? 'EXECUTED');
        } catch (err: any) {
            logger.error('execution failed: ' + String(err?.message ?? err));
            await logProbableTrade(signal, 'EXECUTION_FAILED');
        }
    });


    monitor.on('error', (err) => {
        logger.error('monitor error: ' + String(err));
    });


    monitor.start({ policyId: cfg.assetPolicyId, assetName: cfg.assetNameHex, decimals: 0, verified: true, ticker: 'SNEK' });
    logger.info('cds-trade-scooper-bot (ts) started with polling interval ' + cfg.pollingIntervalMs + 'ms');
}


main().catch(err => {
    console.error('fatal error', err);
    process.exit(1);
});