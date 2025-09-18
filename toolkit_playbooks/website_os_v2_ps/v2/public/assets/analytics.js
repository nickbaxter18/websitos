(function () {
  const U = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "fbclid",
  ];
  const p = new URLSearchParams(location.search),
    utm = {};
  U.forEach((k) => {
    const v = p.get(k);
    if (v) utm[k] = v;
  });
  if (Object.keys(utm).length) localStorage.setItem("utm", JSON.stringify(utm));
  let uid = localStorage.getItem("uid");
  if (!uid) {
    uid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    localStorage.setItem("uid", uid);
  }
})();
