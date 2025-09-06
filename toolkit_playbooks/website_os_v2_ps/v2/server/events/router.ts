export function routeEvent(e: any) {
  switch (e.type) {
    case "lead_submit":
      return sendSequence("lead_capture", e);
    case "purchase":
      return sendSequence("post_purchase", e);
    case "nps_score":
      return e.score <= 6 ? sendSequence("retention_fix", e) : sendSequence("advocacy", e);
    case "cancel_start":
      return scheduleWinback(e.uid);
    default:
      return;
  }
}
export function sendSequence(name: string, e: any) {
  console.log("[sequence]", name, e.uid || "");
}
export function scheduleWinback(uid: string) {
  console.log("[winback scheduled]", uid);
}
