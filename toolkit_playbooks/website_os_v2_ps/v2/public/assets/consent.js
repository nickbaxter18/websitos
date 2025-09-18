(function () {
  var KEY = "consent_choice_v2";
  var banner = document.getElementById("consentBanner");
  if (banner && !localStorage.getItem(KEY)) {
    banner.style.display = "block";
  }

  function loadGA(id) {
    if (window.gaLoaded) return;
    window.gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      dataLayer.push(arguments);
    };
    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true });
    gtag("consent", "update", { analytics_storage: "granted" });
  }

  function on(el, ev, fn) {
    el && el.addEventListener && el.addEventListener(ev, fn);
  }
  on(document.getElementById("consentAccept"), "click", function () {
    localStorage.setItem(KEY, "accepted");
    loadGA(window.GA4_ID || "G-BF3NB7NFEL");
    banner && banner.remove();
  });
  on(document.getElementById("consentDecline"), "click", function () {
    localStorage.setItem(KEY, "declined");
    banner && banner.remove();
  });
})();
