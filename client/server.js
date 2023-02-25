const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    if (!dev) {
      server.use(
        createProxyMiddleware({
          target: "https://squid-app-xbx74.ondigitalocean.app/api",
          changeOrigin: true,
        })
      );
    }

    server.all("https://trial-nine-indol.vercel.app", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on https://squid-app-xbx74.ondigitalocean.app/api");
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });
