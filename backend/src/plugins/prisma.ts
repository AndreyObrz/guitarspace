import fp from "fastify-plugin";
import { PrismaClient } from "../generated/prisma/client.js";

// Расширяем типизацию Fastify: после регистрации плагина у экземпляра появится свойство prisma.
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// fastify-plugin снимает инкапсуляцию, чтобы decorate был виден всему приложению.
export default fp(async (app) => {
  const prisma = new PrismaClient();

  app.decorate("prisma", prisma);

  // Закрываем соединение при остановке сервера.
  app.addHook("onClose", async (inst) => {
    await inst.prisma.$disconnect();
  });
});