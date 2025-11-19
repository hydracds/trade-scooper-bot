import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import cfg from './config';
import { Signal } from './types';


const logDir = cfg.logDir;
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });


const csvWriter = createCsvWriter({
path: path.join(logDir, cfg.csvFilename),
header: [
{ id: 'timestamp', title: 'timestamp' },
{ id: 'price', title: 'price' },
{ id: 'lastPrice', title: 'lastPrice' },
{ id: 'deltaPercent', title: 'deltaPercent' },
{ id: 'action', title: 'action' }
],
append: true
});


export async function logProbableTrade(signal: Signal, action: string) {
const record = {
timestamp: signal.timestamp,
price: signal.price,
lastPrice: signal.lastPrice,
deltaPercent: signal.deltaPercent.toFixed(6),
action
};
try {
await csvWriter.writeRecords([record]);
} catch (err) {
// fallback simple write
console.error('Failed to write CSV record', err);
}
}