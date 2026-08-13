const { CronJob } = require("cron");
const http = require("node:http");
const https = require("node:https");

// incoming request pinging our own public URL every 14 minutes keeps it
const SELF_URL = process.env.RENDER_EXTERNAL_URL;

const job = new CronJob("*/14 * * * *", function () {
  if (!SELF_URL) return; // not running on Render (e.g. local dev) — nothing to ping

  const url = new URL("/health", SELF_URL).href;
  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res) => {
      console.log(
        res.statusCode === 200
          ? "Keep-alive ping sent successfully"
          : `Keep-alive ping returned status ${res.statusCode}`,
      );
    })
    .on("error", (e) => console.error("Keep-alive ping failed:", e.message));
});

module.exports = job;