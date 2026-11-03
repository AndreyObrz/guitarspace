import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { sub: string; email: string };
  }
}

export default fp(async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  // Декоратор для защиты маршрутов
  app.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Invalid or missing token",
        instance: request.url,
      });
    }
  });
});