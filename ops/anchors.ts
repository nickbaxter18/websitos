export type AnchorKind = "before" | "after" | "regex";

/** Resolve anchor into byte offsets using regex against file text. */
export function resolveAnchor(source: string, anchor: string): { kind: AnchorKind; index: number } {
  // Formats:
  //   before:CMD
  //   after:FROM
  //   regex:/^ENV\s+NODE_ENV=.*$/m
  const before = anchor.startsWith("before:");
  const after  = anchor.startsWith("after:");
  const regex  = anchor.startsWith("regex:/");

  if (before || after) {
    const token = anchor.split(":")[1] ?? "";
    // Build a line-start regex for Dockerfile-like tokens (FROM, RUN, CMD, ENV, ARG, USER)
    const re = new RegExp(`^\\s*${escapeRegExp(token)}\\b.*$`, "m");
    const m = source.match(re);
    if (!m || m.index === undefined) throw new Error(`Anchor token not found: ${token}`);
    const lineStart = source.lastIndexOf("\n", m.index) + 1; // start of the matched line
    if (before) return { kind: "before", index: lineStart };
    // after -> index after the matched line
    const lineEnd = source.indexOf("\n", m.index);
    return { kind: "after", index: lineEnd === -1 ? source.length : lineEnd + 1 };
  }

  if (regex) {
    // regex:/.../flags  (flags optional)
    const match = anchor.match(/^regex:\/(.+)\/([gimsuy]*)$/);
    if (!match) throw new Error(`Invalid regex anchor format: ${anchor}`);
    const [, pattern, flags] = match;
    const re = new RegExp(pattern, flags);
    const m = re.exec(source);
    if (!m || m.index === undefined) throw new Error(`Regex anchor not found`);
    return { kind: "regex", index: m.index };
  }

  throw new Error(`Unsupported anchor: ${anchor}`);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}