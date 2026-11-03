import { useEffect, useState } from "react";
import { ArrowUpward } from "@mui/icons-material";
import s from "./TabsPage.module.css";
import { FilterRow } from "@/components/FilterRow";
import { WorkCard } from "@/components/WorkCard";
import { fetchWorks, type WorkDto } from "@/api/worksApi";

const INSTRUMENTS = [
  "Все инструменты",
  "6-струнная",
  "7-струнная",
  "Классика",
  "Бас-гитара",
  "Электрогитара",
];

const STYLES = [
  "Все стили",
  "Fingerstyle",
  "Джаз",
  "Фламенго",
  "Рок",
  "Классическая музыка",
  "Поп и кино",
];

const LEVELS = [
  "Все",
  "Начальный",
  "Средний",
  "Продвинутый",
  "Бесплатно",
  "до 1 500 ₽",
  "до 3 000 ₽",
];

export function TabsPage() {
  const [works, setWorks] = useState<WorkDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [instrument, setInstrument] = useState(INSTRUMENTS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [level, setLevel] = useState(LEVELS[0]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchWorks(1);
        if (mounted) setWorks(data.items);
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

  const filtered = works.filter((w) => {
    // ─── Инструмент ───
    if (instrument !== "Все инструменты") {
      const inst = "instrument" in w ? w.instrument : null;
      if (inst !== instrument) return false;
    }

    // ─── Стиль ───
    if (style !== "Все стили" && w.style !== style) {
      return false;
    }

    // ─── Уровень и цена ───
    if (level !== "Все") {
      if (level === "Бесплатно" && w.price !== 0) return false;
      if (level === "до 1 500 ₽" && w.price > 1500) return false;
      if (level === "до 3 000 ₽" && w.price > 3000) return false;
      if (level === "Начальный" && w.level !== "beginner") return false;
      if (level === "Средний" && w.level !== "intermediate") return false;
      if (level === "Продвинутый" && w.level !== "advanced") return false;
    }

    return true;
  });

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Табы и аранжировки</h1>
        <p>1 284 работы от 640 авторов — покупка и отзыв приносят автору очки рейтинга</p>
      </div>

      <div className={s.toolbar}>
        <span />
        <button className={s.sortBtn} type="button">
          <ArrowUpward fontSize="small" />
          Сортировка: по рейтингу
        </button>
      </div>

      <div className={s.filters}>
        <FilterRow
          label="Инструмент"
          options={INSTRUMENTS}
          value={instrument}
          onChange={setInstrument}
        />
        <FilterRow
          label="Стиль"
          options={STYLES}
          value={style}
          onChange={setStyle}
        />
        <FilterRow
          label="Уровень и цена"
          options={LEVELS}
          value={level}
          onChange={setLevel}
        />
      </div>

      {loading && <p style={{ color: "#9aa0a6" }}>Загрузка...</p>}
      {error && <p style={{ color: "#ef4444" }}>Ошибка: {error}</p>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p style={{ color: "#9aa0a6", textAlign: "center", padding: "40px 0" }}>
              Ничего не найдено. Попробуйте сбросить фильтры.
            </p>
          ) : (
            <>
              <div className={s.grid}>
                {filtered.map((work) => (
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

              <button className={s.loadMore} type="button">
                Показать ещё 24 работы
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}