import Big from "big.js";

/**
 * Pauses execution for the specified number of milliseconds.
 * @param ms Number of milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retries a function until it succeeds or the maximum number of attempts is reached.
 * @param fn The async function to retry
 * @param retries Maximum number of retries (default: 3)
 * @param delayMs Delay between retries in milliseconds (default: 1000)
 */
export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) {
            throw error;
        }
        await sleep(delayMs);
        return retry(fn, retries - 1, delayMs);
    }
}

export function lovelaceToAda(lovelace: number) {
    return Big(lovelace.toString()).div(
        Big(10).pow(6)
    ).toNumber();
}
