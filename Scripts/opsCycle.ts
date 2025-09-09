import { runCycle } from "../ops/index"

const args = process.argv
const type = args[2]
const file = args[3]
const anchor = args[4]
const payload = args[5]
const rest = args.slice(6)
const profileArg = (rest.find(a => a.startsWith("--profile="))?.split("=")[1] ?? "Balanced") as "Strict"|"Balanced"|"Fast"
const simulateArg = (rest.find(a => a.startsWith("--simulate="))?.split("=")[1] ?? "none") as "none"|"secrets"|"cve"|"access-fail"

if (!type || !file) {
  console.error('Usage: ts-node -P tsconfig.ops.json scripts/opsCycle.ts <insert|replace|append> <file> "before:CMD" "PAYLOAD" [--profile=Strict|Balanced|Fast] [--simulate=none|secrets|cve|access-fail"]')
  process.exit(1)
}

runCycle(
  { type: type as any, file, anchors: anchor ? [anchor] : [], payload },
  { profile: profileArg, simulate: simulateArg }
)
  .then((r: { decision: string; reason: string }) => {
    const msg = `decision=${r.decision} reason=${r.reason}`
    console.log(msg)
    if (r.decision !== "approved") process.exitCode = 2
  })
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })