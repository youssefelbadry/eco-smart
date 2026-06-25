const fetch = require("node-fetch");

(async () => {
  try {
    const base = "http://127.0.0.1:4000";
    const email = `user${Date.now()}@example.com`;
    const password = "SecurePass1";
    console.log("Signup", email);
    let res = await fetch(`${base}/api_signup.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: "Test User", email, password }),
    });
    const signup = await res.json();
    console.log("signup status", res.status, signup.success, signup.message);
    if (!signup.success) return process.exit(1);

    res = await fetch(`${base}/api_login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_or_username: email, password }),
    });
    const login = await res.json();
    console.log("login status", res.status, login.success, login.message);
    if (!login.success) return process.exit(1);
    const token = login.data.token;
    const endpoints = [
      "/api_devices_list.php",
      "/api_devices_dashboard.php",
      "/api_categories_counts.php",
      "/api_usage_overview.php",
      "/api_usage_trend.php",
      "/api_alerts_list.php",
      "/api_alerts_counts.php",
      "/api_alerts_trend.php",
      "/api/ai/full-output",
      "/api/ai/forecast",
      "/api/ai/summary",
      "/api/ai/appliances",
      "/api/ai/devices",
      "/api/ai/alerts",
      "/api/ai/chart-data",
      "/api/ai/notifications",
    ];
    for (const ep of endpoints) {
      const url = `${base}${ep}`;
      console.log(`CALL ${ep}`);
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.text();
      console.log(`> ${ep} ${response.status}`);
      console.log(body.slice(0, 300));
      if (response.status !== 200) {
        console.error("FAILED", ep);
        process.exit(1);
      }
    }
    console.log("ALL_ENDPOINTS_OK");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
