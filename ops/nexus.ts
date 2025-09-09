import fs from "node:fs";
import { QALog, SecLog, HarmonyLog } from "./types";

export function writeQA(path: string, qa: QALog) { fs.writeFileSync(path, JSON.stringify(qa, null, 2)); }
export function writeSEC(path: string, sec: SecLog) { fs.writeFileSync(path, JSON.stringify(sec, null, 2)); }
export function writeHarmony(path: string, h: HarmonyLog) { fs.writeFileSync(path, JSON.stringify(h, null, 2)); }