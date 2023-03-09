const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const csrfMiddleware = async (req, res, next) => {
  try {
    const response = await fetch('https://108e-165-232-125-166.ngrok.io/api/csrf-token', { credentials: 'include' });
    const { csrfToken } = await response.json();
    req.headers['x-csrf-token'] = csrfToken;

    // Set the Access-Control-Allow-Origin header to the specific origin that is allowed to access the resource
    res.setHeader('Access-Control-Allow-Origin', 'https://trial-umber.vercel.app');

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
          target: "https://108e-165-232-125-166.ngrok.io/api",
          changeOrigin: true,
        })
      );
    }

    server.all("https://trial-umber.vercel.app", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on https://108e-165-232-125-166.ngrok.io/api");
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });
