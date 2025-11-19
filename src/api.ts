// src/api.ts
import axios from "axios";
import dotenv from "dotenv";
import cfg from './config';

dotenv.config();

const api = axios.create({
  baseURL: cfg.baseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": cfg.apiKey
  }
});

/**
 * Get token price from any endpoint
 */
export async function getSwapEstimate(payload: any) {
  try {
    const res = await api.post(`cds/swap/aggregate`, payload);
    return res.data;
  } catch (e: any) {
    console.log(e.data);
    return null;
  }
}

/**
 * Execute a sample mock trade
 */
export async function executeTrade(payload: any) {
  const res = await api.post("cds/swap/cbor/build", payload);
  return res.data;
}

/**
 * Simple API health check
 */
export async function health() {
  const res = await api.get("/health");
  return res.data;
}
