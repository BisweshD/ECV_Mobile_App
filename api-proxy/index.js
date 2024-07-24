import Fastify from "fastify";
import cors from "@fastify/cors";
import proxy from "@fastify/http-proxy";
import formData from "@fastify/formbody";

const server = Fastify();
const port = 8080;

/**
 * @see {@link https://github.com/fastify/fastify-cors?tab=readme-ov-file#options}
 */
await server.register(cors, {
  origin: true,
  credentials: true,
});

/**
 * @see {@link https://github.com/fastify/fastify-formbody}
 */
await server.register(formData);

/**
 * @see {@link https://github.com/fastify/fastify-http-proxy?tab=readme-ov-file}
 */
await server.register(proxy, {
  /**
   * e.g., `http://localhost:${port}/api/configured-variables` will be proxied to https://api.giovanni.earthdata.nasa.gov/configured-variables
   */
  prefix: "/api",
  upstream: "https://api.giovanni.earthdata.nasa.gov",
  /**
   * @see {@link https://github.com/fastify/fastify-reply-from#replyfromsource-opts}
   */
  replyOptions: {
    rewriteRequestHeaders: (originalReq, headers) => {
      return {
        "request-id": "essential-climate-variables-app",
      };
    },
  },
});

/**
 * This endpoint receives a redirect from EDL and requests a token from the provided code, returning part of the response.
 * NOTE: do not send the refresh token to the client, as its long expiry makes it unsuitable to store. What would happen if it leaked?
 */
server.get("/auth", {}, async (request, reply) => {
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

    return reply.send({ access_token, expires_in, token_type });
  } catch (error) {
    console.error(error);

    return reply.send(500);
  }
});

try {
  await server.listen({ port });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
