const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const csrfMiddleware = async (req, res, next) => {
  try {
    const response = await fetch('https://monkfish-app-i3xii.ondigitalocean.app/api/csrf-token', { credentials: 'include' });
    const { csrfToken } = await response.json();
    req.headers['x-csrf-token'] = csrfToken;

    // Set the Access-Control-Allow-Origin header to the specific origin that is allowed to access the resource
    res.setHeader('Access-Control-Allow-Origin', 'https://trial-nine-indol.vercel.app');

    next();
  } catch (error) {
    next(error);
  }
};

app
  .prepare()
  .then(() => {
    const server = express();

    if (!dev) {
      server.use(
        createProxyMiddleware({
          target: "https://monkfish-app-i3xii.ondigitalocean.app/api",
          changeOrigin: true,
        })
      );
    }

    server.all("https://trial-nine-indol.vercel.app", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on https://monkfish-app-i3xii.ondigitalocean.app/api");
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });
