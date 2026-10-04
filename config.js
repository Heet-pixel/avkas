/* =========================================================
   config.js – THE ONE PLACE the backend address is set.
   Every page loads this file first.
   ========================================================= */
(function () {
  // ▼▼▼ Change ONLY this line if the backend address changes
  //     (when avkasco.com goes live you may switch to "https://api.avkasco.com") ▼▼▼
  var PRODUCTION_API = "https://avkas-backend.onrender.com";

  // Used automatically when you open the site on your own computer (backend: npm start in the backend folder)
  var LOCAL_API = "http://localhost:4000";

  var host = location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
  var base = (isLocal ? LOCAL_API : PRODUCTION_API).replace(/\/+$/, "");

  window.AVKAS_CONFIG = {
    API_BASE_URL: base,
    API: {
      wake: base + "/api/wake",
      health: base + "/api/health",
      contact: base + "/api/contact",
      career: base + "/api/career"
    }
  };
})();
