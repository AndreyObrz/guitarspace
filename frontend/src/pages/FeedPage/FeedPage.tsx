import { useEffect, useState } from "react";
import clsx from "clsx";
import s from "./FeedPage.module.css";
import { WorkCard } from "@/components/WorkCard";
import { TopWeekCard, type TopWeekAuthor } from "@/components/TopWeekCard";
import { AuthorsList } from "@/components/AuthorsList";
import type { AuthorCardProps } from "@/components/AuthorCard";
import { fetchWorks, type WorkDto } from "@/api/worksApi";
import { fetchTop, type TopResponseDto } from "@/api/topApi";
import { useAuth } from "@/context/auth";

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "arrangement", label: "Аранжировки" },
  { id: "tab", label: "Табы" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const STYLE_AUTHORS: AuthorCardProps[] = [
  { name: "Нильс Беккер", style: "Фламенго", points: 3940 },
  { name: "Софья Ким", style: "Fingerstyle", points: 4610 },
  { name: "Тимур Асланов", style: "Джаз-блюз", points: 5210 },
];

export function FeedPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterId>("all");
  const [works, setWorks] = useState<WorkDto[]>([]);
  const [topData, setTopData] = useState<TopResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [worksData, top] = await Promise.all([
          fetchWorks(1),
          fetchTop(),
        ]);
        if (mounted) {
          setWorks(worksData.items);
          setTopData(top);
        }
      } catch (e) {
        if (mounted) setError((e as Error).message || "Ошибка загрузки");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const visible =
    filter === "all" ? works : works.filter((w) => w.tag === filter);

  // Топ: топ-3 из API + текущий пользователь на своём месте
  const topWeek: TopWeekAuthor[] = topData
    ? topData.authors.map((a) => ({
        place: a.place,
        name: a.name,
        points: a.points,
        delta: a.delta,
        isMe: a.isMe,
      }))
    : [];

  return (
    <div className={s.layout}>
      <div className={s.page}>
        <div className={s.hero}>
          <h1>Добрый вечер, {user?.name?.split(" ")[0] ?? "Гость"}</h1>
          <p>Сегодня в ленте 128 новинок от 4 812 гитаристов</p>
        </div>

        <div className={s.tabs}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(s.tab, filter === f.id && s.tabActive)}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#9aa0a6" }}>Загрузка...</p>}
        {error && <p style={{ color: "#ef4444" }}>Ошибка: {error}</p>}

        {!loading && !error && (
          <div className={s.grid}>
            {visible.map((work) => (
              <WorkCard
                key={work.id}
                id={work.id}
                tag={work.tag}
                title={work.title}
                authorName={work.authorName}
                price={work.price}
                previewGradient={work.previewGradient}
              />
            ))}
          </div>
        )}
      </div>

      <aside className={s.side}>
        {topWeek.length > 0 && <TopWeekCard authors={topWeek} />}
        <AuthorsList authors={STYLE_AUTHORS} />
      </aside>
    </div>
  );
}