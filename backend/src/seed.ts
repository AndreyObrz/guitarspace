import { PrismaClient } from "./generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  // ─── Работы ───
  await prisma.work.createMany({
    data: [
      {
        id: "1",
        tag: "arrangement",
        title: "Bohemian Rhapsody — полная аранжировка для 6-струнной",
        authorName: "Кирилл Морозов",
        price: 1900,
        previewGradient: "linear-gradient(135deg, #ff6a1a, #ff2e63)",
        style: "Рок",
        level: "advanced",
        instruments: ["6-string", "bass", "drums"],
        partsCount: 3,
      },
      {
        id: "2",
        tag: "tab",
        title: "Aurora — fingerstyle аранжировка для 6-струнной",
        authorName: "Кирилл Морозов",
        price: 1200,
        previewGradient: "linear-gradient(135deg, #a855f7, #3b82f6)",
        style: "Fingerstyle",
        level: "intermediate",
        instrument: "6-string",
        pages: 5,
        tuning: "Standard",
        hasGtp: true,
      },
      {
        id: "3",
        tag: "tab_video",
        title: "Скандинавский джаз — импровизация по боксам",
        authorName: "Ида Хольм",
        price: 1450,
        previewGradient: "linear-gradient(135deg, #22c55e, #0ea5e9)",
        style: "Джаз",
        level: "advanced",
        instrument: "6-string",
        videoDuration: 720,
        pages: 3,
      },
      {
        id: "4",
        tag: "tab",
        title: "Ноктюрн Op. 9 №2 — классическая аранжировка",
        authorName: "Ева Ланге",
        price: 890,
        previewGradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
        style: "Классическая музыка",
        level: "intermediate",
        instrument: "classical",
        pages: 4,
        tuning: "Standard",
        hasGtp: false,
      },
      {
        id: "5",
        tag: "arrangement",
        title: "La Bamba — аранжировка для трёх гитар",
        authorName: "Марк Доваль",
        price: 0,
        previewGradient: "linear-gradient(135deg, #10b981, #059669)",
        style: "Поп и кино",
        level: "beginner",
        instruments: ["6-string", "6-string", "bass"],
        partsCount: 3,
      },
      {
        id: "6",
        tag: "tab",
        title: "Take Five — разбор необычного размера 5/4",
        authorName: "Кирилл Морозов",
        price: 1650,
        previewGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        style: "Джаз",
        level: "advanced",
        instrument: "6-string",
        pages: 6,
        tuning: "Standard",
        hasGtp: true,
      },
    ],
    skipDuplicates: true,
  });

  // ─── Курсы ───
  await prisma.course.createMany({
    data: [
      {
        id: "c1",
        title: "Fingerstyle с нуля: первые 30 дней",
        authorName: "Анна Рейн",
        price: 3900,
        previewGradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        style: "Fingerstyle",
        level: "beginner",
        lessons: 18,
        duration: "4 ч 20 мин",
        hasCertificate: true,
      },
      {
        id: "c2",
        title: "Джазовая гармония: аккорды и замены",
        authorName: "Ида Хольм",
        price: 5400,
        previewGradient: "linear-gradient(135deg, #a855f7, #ec4899)",
        style: "Джаз",
        level: "intermediate",
        lessons: 24,
        duration: "6 ч 10 мин",
      },
      {
        id: "c3",
        title: "Фламенго: расгеадо и компас",
        authorName: "Нильс Беккер",
        price: 4800,
        previewGradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
        style: "Фламенго",
        level: "advanced",
        lessons: 20,
        duration: "5 ч 30 мин",
      },
      {
        id: "c4",
        title: "Классическая техника: этюды Каркасси",
        authorName: "Ева Ланге",
        price: 6800,
        previewGradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        style: "Классическая музыка",
        level: "intermediate",
        lessons: 32,
        duration: "8 ч 40 мин",
        hasCertificate: true,
      },
      {
        id: "c5",
        title: "Импровизация в джаз-блюзе",
        authorName: "Тимур Асланов",
        price: 5400,
        previewGradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
        style: "Джаз",
        level: "intermediate",
        lessons: 24,
        duration: "6 ч 10 мин",
      },
      {
        id: "c6",
        title: "Рок-риффы: техника и звук",
        authorName: "Марк Доваль",
        price: 2900,
        previewGradient: "linear-gradient(135deg, #10b981, #22c55e)",
        style: "Рок",
        level: "beginner",
        lessons: 16,
        duration: "3 ч 50 мин",
      },
    ],
    skipDuplicates: true,
  });

  // ─── Профиль ───
    // ─── Профиль для тестового пользователя ───
  const testUser = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  if (testUser) {
    await prisma.profile.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        name: testUser.name ?? "Тест Тестов",
        username: "@test",
        isTeacher: true,
        avatarGradient: "linear-gradient(135deg, #ff6a1a, #ec4899)",
        coverGradient: "linear-gradient(135deg, #8b5cf6, #ec4899, #ff6a1a)",
        instruments: ["6-струнная", "Fingerstyle", "Джаз-блюз"],
        bio: "Играю 14 лет, преподаю fingerstyle и джаз-блюз.",
        youtube: "youtube.com/andreyguitar",
        telegram: "@andrey_guitar",
        website: "andrey-tabs.ru",
        points: 4820,
        rank: 12,
        rankLabel: "Мастер",
        publications: 128,
        earnings: 84500,
        progressCurrent: 4820,
        progressTarget: 5800,
        progressLabel: "Виртуоз",
      },
    });
  }

  // ─── Топ ───
  await prisma.topAuthor.createMany({
    data: [
      { place: 1, name: "Кирилл Морозов", points: 6240, delta: 2, rankLabel: "Мастер" },
      { place: 2, name: "Ева Ланге", points: 5880, delta: 1, rankLabel: "Мастер" },
      { place: 3, name: "Ида Хольм", points: 5640, delta: 0, rankLabel: "Мастер" },
      { place: 4, name: "Марк Доваль", points: 5500, delta: -1, rankLabel: "Мастер" },
      { place: 5, name: "Тимур Асланов", points: 5400, delta: 2, rankLabel: "Мастер" },
      { place: 6, name: "Софья Ким", points: 5300, delta: 1, rankLabel: "Мастер" },
      { place: 7, name: "Нильс Беккер", points: 5160, delta: 1, rankLabel: "Мастер" },
      { place: 8, name: "Кай Морозов", points: 5100, delta: 0, rankLabel: "Мастер" },
      { place: 9, name: "Вера Лебедева", points: 4790, delta: -2, rankLabel: "Виртуоз" },
      { place: 12, name: "Андрей Обрезков", points: 4820, delta: 3, rankLabel: "Мастер", isMe: true },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());