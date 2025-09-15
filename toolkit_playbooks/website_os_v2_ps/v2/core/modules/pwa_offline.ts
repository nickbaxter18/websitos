export default {
  flag: "pwa_offline",
  async apply(html: string) {
    return html.replace(
      "</body>",
      `<script>if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}</script></body>`
    );
  },
};
