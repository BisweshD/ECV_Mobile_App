require("dotenv").config();
const fetch = require("node-fetch");
const proxy = require("express-http-proxy");
const express = require("express");
const cors = require("cors");

const server = express();
const port = 8080;

/**
 * @see {@type https://github.com/expressjs/cors}
 */
server.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

/**
 * @see {@link https://github.com/villadora/express-http-proxy}
 * `http://localhost:${port}/api/configured-variables` will be proxied to https://api.giovanni.earthdata.nasa.gov/configured-variables
 */
server.use(
  "/api",
  proxy("api.giovanni.earthdata.nasa.gov", {
    https: true,
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      proxyReqOpts.headers["request-id"] = "essential-climate-variables-app";

      return proxyReqOpts;
    },
  }),
);

/**
 * This endpoint receives a redirect from EDL and requests a token from the provided code, returning part of the response.
 * NOTE: do not send the refresh token to the client, as its long expiry makes it unsuitable to store. What would happen if it leaked?
 */
server.get("/auth", async (request, response, next) => {
  try {
    const code = request.query.code;
    const appCredentials = Buffer.from(process.env.APP_AUTH).toString("base64");
    const redirectUrl = `https://localhost:3000/auth`;
    const tokenUrl = `https://urs.earthdata.nasa.gov/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}`;

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Basic ${appCredentials}`,
      },
    });

    const { access_token, expires_in, token_type } = await tokenResponse.json();

    response.send({ access_token, expires_in, token_type });
    next();
  } catch (error) {
    console.error(error);

    next(error);
  }
});

try {
  server.listen(port);
} catch (error) {
  console.error(error);

  process.exit(1);
}
