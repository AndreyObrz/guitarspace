import { useEffect, useState } from "react";
import s from "./CoursesPage.module.css";
import { FilterRow } from "@/components/FilterRow";
import { CourseCard } from "@/components/CourseCard";
import { fetchCourses, type CourseDto } from "@/api/coursesApi";

const LEVELS = ["Все", "Начальный", "Средний", "Продвинутый"];

const STYLES = [
  "Все стили",
  "Fingerstyle",
  "Джаз",
  "Фламенго",
  "Классическая музыка",
  "Рок",
];

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [level, setLevel] = useState(LEVELS[0]);
  const [style, setStyle] = useState(STYLES[0]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCourses(1);
        if (mounted) setCourses(data.items);
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

  const filtered = courses.filter((c) => {
    if (level !== "Все") {
      if (level === "Начальный" && c.level !== "beginner") return false;
      if (level === "Средний" && c.level !== "intermediate") return false;
      if (level === "Продвинутый" && c.level !== "advanced") return false;
    }
    if (style !== "Все стили" && c.style !== style) return false;
    return true;
  });

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1>Курсы игры на гитаре</h1>
        <p>148 курсов от преподавателей — за пройденный курс начисляются очки рейтинга</p>
      </div>

      <div className={s.toolbar}>
        <span />
        <button type="button" className={s.teachBtn}>
          Стать преподавателем
        </button>
      </div>

      <div className={s.filters}>
        <FilterRow
          label="Уровень"
          options={LEVELS}
          value={level}
          onChange={setLevel}
        />
        <FilterRow
          label="Стиль"
          options={STYLES}
          value={style}
          onChange={setStyle}
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
            <div className={s.grid}>
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}