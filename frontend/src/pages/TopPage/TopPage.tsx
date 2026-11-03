import { useEffect, useState } from "react";
import clsx from "clsx";
import s from "./TopPage.module.css";
import { Avatar, ProgressBar } from "@/components/ui";
import { fetchTop, type TopResponseDto } from "@/api/topApi";

const PERIODS = [
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
  { id: "all", label: "Всё время" },
] as const;

type PeriodId = (typeof PERIODS)[number]["id"];

export function TopPage() {
  const [data, setData] = useState<TopResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodId>("week");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchTop();
        if (mounted) setData(res);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !data) return <p className={s.loading}>Загрузка...</p>;

  const top3 = data.authors.slice(0, 3);
  const rest = data.authors.slice(3);

  // Переставляем пьедестал: [2-е, 1-е, 3-е]
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const me = data.me;

  const progressPct = me
    ? Math.min(
        100,
        Math.round((me.points / (me.nextPoints ?? me.points ?? 1)) * 100)
      )
    : 0;

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Топ гитаристов</h1>
        <p>
          {(me?.totalParticipants ?? 5412).toLocaleString("ru")} участников · очки обновляются каждый час · сезон длится 12 недель
        </p>
      </div>

      <div className={s.periods}>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={clsx(s.period, period === p.id && s.periodActive)}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={s.layout}>
        <div className={s.main}>
          {/* Пьедестал */}
          <div className={s.podium}>
            {podiumOrder.map((author) => (
              <div
                key={author.place}
                className={clsx(
                  s.podiumCard,
                  author.place === 1 && s.podiumCardFirst
                )}
              >
                <span
                  className={clsx(
                    s.podiumPlace,
                    author.place === 1 && s.podiumPlaceFirst
                  )}
                >
                  {author.place}
                </span>
                <Avatar name={author.name} size={author.place === 1 ? 64 : 52} />
                <span className={s.podiumName}>{author.name}</span>
                <span className={s.podiumPoints}>
                  {author.points.toLocaleString("ru")} очков
                </span>
                <span className={s.podiumRank}>{author.rankLabel}</span>
                {author.delta > 0 && (
                  <span className={s.podiumDelta}>+{author.delta} за неделю</span>
                )}
              </div>
            ))}
          </div>

          {/* Таблица */}
          <div className={s.table}>
            <div className={s.tableHead}>
              <span>#</span>
              <span>Гитарист</span>
              <span>Разряд</span>
              <span>Очки</span>
              <span>Δ</span>
              <span>Действие</span>
            </div>

            {rest.map((author, i) => {
              const prev = rest[i - 1];
              const showDivider =
                author.isMe && prev && author.place - prev.place > 1;

              const deltaClass =
                author.delta > 0
                  ? s.deltaUp
                  : author.delta < 0
                  ? s.deltaDown
                  : s.deltaFlat;

              const deltaLabel =
                author.delta > 0
                  ? `+${author.delta}`
                  : author.delta < 0
                  ? `${author.delta}`
                  : "0";

              return (
                <div key={author.place}>
                  {showDivider && <div className={s.divider}>···</div>}
                  <div
                    className={clsx(
                      s.tableRow,
                      author.isMe && s.tableRowMe
                    )}
                  >
                    <span className={s.cellPlace}>{author.place}</span>
                    <span className={s.cellAuthor}>
                      <Avatar name={author.name} size={32} />
                      <span className={s.cellName}>
                        {author.name}
                        {author.isMe && <span className={s.youBadge}>— вы</span>}
                      </span>
                    </span>
                    <span className={s.cellRank}>{author.rankLabel}</span>
                    <span className={s.cellPoints}>
                      {author.points.toLocaleString("ru")}
                    </span>
                    <span className={clsx(s.cellDelta, deltaClass)}>
                      {deltaLabel}
                    </span>
                    <span>
                      <button type="button" className={s.challengeBtn}>
                        Вызвать
                      </button>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Правая колонка: Моё место */}
        <aside className={s.side}>
          {me ? (
            <div className={s.myPlace}>
              <span className={s.myPlaceLabel}>Моё место</span>
              <span className={s.myPlaceValue}>№{me.place}</span>
              <span className={s.myPlaceSub}>
                из {(me.totalParticipants ?? 5412).toLocaleString("ru")} участников
              </span>

              <div className={s.myPlaceProgress}>
                <ProgressBar value={progressPct} />
                <div className={s.myPlaceNext}>
                  <span>
                    Разрыв с №{me.nextPlace ?? me.place - 1}:{" "}
                    {((me.nextPoints ?? 0) - me.points).toLocaleString("ru")} очков
                  </span>
                </div>
              </div>

              <div className={s.nextList}>
                <div className={s.nextItem}>
                  <span className={s.nextItemPlace}>
                    {me.nextPlace ?? me.place - 1}
                  </span>
                  <span className={s.nextItemName}>{me.nextName ?? "—"}</span>
                  <span className={s.nextItemPoints}>
                    {(me.nextPoints ?? 0).toLocaleString("ru")} очков
                  </span>
                </div>
              </div>

              <div className={s.myPlaceActions}>
                <button type="button" className={s.btnPrimary}>
                  Вызвать соперника
                </button>
                <button type="button" className={s.btnGhost}>
                  Как считаются очки
                </button>
              </div>
            </div>
          ) : (
            <div className={s.myPlace}>
              <span className={s.myPlaceLabel}>Моё место</span>
              <p style={{ color: "#9aa0a6", fontSize: 14 }}>
                Войдите, чтобы увидеть своё место в топе
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}