import Fastify, { type FastifyError } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import { STATUS_CODES } from 'node:http'
import { Type as T } from '@sinclair/typebox'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { ValidationProblem, ProblemDetails, User, Health } from './types.js'

import prismaPlugin from "./plugins/prisma.js";
import jwtPlugin from "./plugins/jwt.js";
import bcrypt from "bcrypt";
/**
 * Временное in-memory хранилище. На следующей лабе оно уедет в Postgres + Prisma,
 * а пока этого достаточно, чтобы научиться писать маршруты и схемы.
 */


export async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
    schemaErrorFormatter(errors, dataVar) {
      const msg = errors.map((e) => e.message).filter(Boolean).join('; ') || 'Validation failed'
      return new ValidationProblem(msg, errors, dataVar)
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  // Инфраструктурные плагины

  await app.register(helmet);
  await app.register(prismaPlugin);
  await app.register(jwtPlugin);

  // Для dev открываем localhost фронтенда, чтобы CORS-запросы из браузера проходили.
  await app.register(cors, {
    origin: [
      'https://andreyobrz.github.io',
      /^http:\/\/localhost:\d+$/,
    ],
    credentials: false,
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    enableDraftSpec: true,
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
    errorResponseBuilder(request, ctx) {
      const seconds = Math.ceil(ctx.ttl / 1000)
      return {
        type: 'about:blank',
        title: 'Too Many Requests',
        status: 429,
        detail: `Rate limit exceeded. Retry in ${seconds} seconds.`,
        instance: request.url,
      } satisfies ProblemDetails
    },
  })

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Rooms API',
        version: '1.0.0',
        description: 'HTTP-API, совместимый с RFC 9457 (Problem Details).',
      },
      servers: [{ url: 'http://localhost:3000' }],
      tags: [
        { name: 'Users', description: 'Маршруты для управления пользователями' },
        { name: 'System', description: 'Служебные эндпоинты' },
      ],
    },
  })

  // Глобальные обработчики ошибок

  app.setErrorHandler<FastifyError | ValidationProblem>((err, req, reply) => {
    const status = typeof err.statusCode === 'number' ? err.statusCode : 500
    const isValidation = err instanceof ValidationProblem

    const problem = {
      type: 'about:blank',
      title: STATUS_CODES[status] ?? 'Error',
      status,
      detail: err.message || 'Unexpected error',
      instance: req.url,
      ...(isValidation ? { errorsText: err.message } : {}),
    }

    reply.code(status).type('application/problem+json').send(problem)
  })

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).type('application/problem+json').send({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: `Route ${request.method} ${request.url} not found`,
      instance: request.url,
    } satisfies ProblemDetails)
  })

  // Маршруты API

  app.get(
    '/api/users',
    {
      schema: {
        operationId: 'listUsers',
        tags: ['Users'],
        summary: 'Возвращает список пользователей',
        response: {
          200: {
            description: 'Список пользователей',
            content: { 'application/json': { schema: T.Array(User) } },
          },
          429: {
            description: 'Too Many Requests',
            content: { 'application/problem+json': { schema: ProblemDetails } },
          },
          500: {
            description: 'Internal Server Error',
            content: { 'application/problem+json': { schema: ProblemDetails } },
          },
        },
      },
    },
    async () => {
        return app.prisma.user.findMany({
            select: { id: true, email: true },
        });
    }
  )

  app.get(
    '/api/health',
    {
      schema: {
        operationId: 'health',
        tags: ['System'],
        summary: 'Проверка работоспособности процесса',
        response: {
          200: { description: 'Ready', content: { 'application/json': { schema: Health } } },
          500: { description: 'Internal Server Error', content: { 'application/problem+json': { schema: ProblemDetails } } },
        },
      },
    },
    async () => ({ ok: true })
  )

  // hide скрывает сам маршрут из генерируемой спецификации.
  app.get(
    '/openapi.json',
    { schema: { hide: true } },
    async (_req, reply) => {
      reply.type('application/json').send(app.swagger())
    }
  )

    // ─── Works ───
  app.get(
    '/api/works',
    {
      schema: {
        operationId: 'listWorks',
        tags: ['Works'],
        summary: 'Список работ',
      },
    },
    async () => {
        const items = await app.prisma.work.findMany();
        return { items, page: 1, total: items.length };
        }
  );

  app.get(
    '/api/works/:id',
    {
      schema: {
        operationId: 'getWork',
        tags: ['Works'],
        summary: 'Работа по id',
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const work = await app.prisma.work.findUnique({ where: { id } });
      if (!work) {
        return reply.code(404).send({ error: 'Not found' });
      }
      return work;
    }
  );

  // ─── Courses ───
  app.get(
    '/api/courses',
    {
      schema: {
        operationId: 'listCourses',
        tags: ['Courses'],
        summary: 'Список курсов',
      },
    },
    async () => {
        const items = await app.prisma.course.findMany();
        return { items, page: 1, total: items.length };
        }
  );

  app.get(
    '/api/courses/:id',
    {
      schema: {
        operationId: 'getCourse',
        tags: ['Courses'],
        summary: 'Курс по id',
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const course = await app.prisma.course.findUnique({ where: { id } });
      if (!course) {
        return reply.code(404).send({ error: 'Not found' });
      }
      return course;
    }
  );

  // ─── Profile ───
  app.get(
    '/api/profile/:id',
    {
      schema: {
        operationId: 'getProfile',
        tags: ['Profile'],
        summary: 'Профиль по userId',
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };

      // id — это userId (а не id профиля)
      const profile = await app.prisma.profile.findUnique({
        where: { userId: id },
      });

      if (!profile) {
        return reply.code(404).send({ error: 'Not found' });
      }

      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        isTeacher: profile.isTeacher,
        avatarGradient: profile.avatarGradient,
        coverGradient: profile.coverGradient,
        instruments: profile.instruments,
        bio: profile.bio,
        links: {
          youtube: profile.youtube ?? undefined,
          telegram: profile.telegram ?? undefined,
          website: profile.website ?? undefined,
        },
        stats: {
          points: profile.points,
          rank: profile.rank,
          rankLabel: profile.rankLabel,
          publications: profile.publications,
          earnings: profile.earnings,
        },
        progress: {
          current: profile.progressCurrent,
          target: profile.progressTarget,
          targetLabel: profile.progressLabel,
        },
      };
    }
  );

  // ─── Top ───
    app.get(
    '/api/top',
    {
      schema: {
        operationId: 'getTop',
        tags: ['Top'],
        summary: 'Топ гитаристов',
      },
    },
    async (req) => {
      // Топ-3 из БД (без isMe)
      const top3 = await app.prisma.topAuthor.findMany({
        where: { isMe: false },
        orderBy: { place: 'asc' },
        take: 3,
      });

      // Пробуем получить текущего пользователя из токена (если он есть)
      let meBlock = null;

      try {
        await req.jwtVerify();
        const userId = (req.user as { sub: string }).sub;

        const profile = await app.prisma.profile.findUnique({
          where: { userId },
        });

        if (profile) {
          // Находим "место" пользователя в общем рейтинге.
          // Пока — заглушка: используем rank из профиля.
          const place = profile.rank > 0 ? profile.rank : 999;
          const points = profile.points;

                    meBlock = {
            place: profile.rank > 0 ? profile.rank : 999,
            name: profile.name,
            points: profile.points,
            delta: 0,
            rankLabel: profile.rankLabel,
            isMe: true,
            nextPlace: profile.rank > 1 ? profile.rank - 1 : 1,
            nextName: "",
            nextPoints: 0,
            totalParticipants: 5412,
          };
        }
      } catch {
        // Нет токена — ок, без блока "me"
      }

      const authors = [
        ...top3.map((a) => ({
          place: a.place,
          name: a.name,
          points: a.points,
          delta: a.delta,
          rankLabel: a.rankLabel,
          isMe: false,
        })),
        ...(meBlock ? [meBlock] : []),
      ];

      return {
        authors,
        me: meBlock,
      };
    }
  );

    // ─── Auth ───

  // POST /api/auth/register
  app.post(
    "/api/auth/register",
    {
      schema: {
        operationId: "register",
        tags: ["Auth"],
        summary: "Регистрация",
        body: T.Object({
          email: T.String({ format: "email" }),
          password: T.String({ minLength: 6 }),
          name: T.Optional(T.String()),
        }),
      },
    },
    async (req, reply) => {
      const { email, password, name } = req.body as {
        email: string;
        password: string;
        name?: string;
      };

      const existing = await app.prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.code(409).send({
          type: "about:blank",
          title: "Conflict",
          status: 409,
          detail: "Email already registered",
          instance: req.url,
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await app.prisma.user.create({
        data: {
          email,
          passwordHash,
          name: name ?? null,
        },
        select: { id: true, email: true, name: true },
      });
      // созда
      await app.prisma.profile.create({
        data: {
          userId: user.id,
          name: user.name ?? email.split("@")[0] ?? "User",
          username: "@" + email.split("@")[0],
          avatarGradient: "linear-gradient(135deg, #ff6a1a, #ec4899)",
          coverGradient: "linear-gradient(135deg, #8b5cf6, #ec4899, #ff6a1a)",
          instruments: [],
          bio: "",
          points: 0,
          rank: 0,
          rankLabel: "Новичок",
          publications: 0,
          earnings: 0,
          progressCurrent: 0,
          progressTarget: 100,
          progressLabel: "Ученик",
        },
      });



      const token = app.jwt.sign({ sub: user.id, email: user.email });

      return reply.code(201).send({ user, token });
    }
  );

  // POST /api/auth/login
  app.post(
    "/api/auth/login",
    {
      schema: {
        operationId: "login",
        tags: ["Auth"],
        summary: "Вход",
        body: T.Object({
          email: T.String({ format: "email" }),
          password: T.String({ minLength: 1 }),
        }),
      },
    },
    async (req, reply) => {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const user = await app.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.code(401).send({
          type: "about:blank",
          title: "Unauthorized",
          status: 401,
          detail: "Invalid email or password",
          instance: req.url,
        });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return reply.code(401).send({
          type: "about:blank",
          title: "Unauthorized",
          status: 401,
          detail: "Invalid email or password",
          instance: req.url,
        });
      }

      const token = app.jwt.sign({ sub: user.id, email: user.email });

      return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      };
    }
  );

  // GET /api/auth/me
  app.get(
    "/api/auth/me",
    {
      onRequest: [app.authenticate],
      schema: {
        operationId: "me",
        tags: ["Auth"],
        summary: "Текущий пользователь",
      },
    },
    async (req) => {
      const userId = req.user.sub;
      const user = await app.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });
      return user;
    }
  );

  return app
}

