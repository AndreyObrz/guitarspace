import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import s from "./CoursePage.module.css";
import { Avatar } from "@/components/ui";
import { fetchCourseById, type CourseDto } from "@/api/coursesApi";

const LEVEL_LABEL: Record<CourseDto["level"], string> = {
  beginner: "НАЧАЛЬНЫЙ",
  intermediate: "СРЕДНИЙ",
  advanced: "ПРОДВИНУТЫЙ",
};

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCourseById(id);
        if (mounted) setCourse(data);
      } catch (e) {
        if (mounted) setError((e as Error).message || "Ошибка загрузки");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p className={s.loading}>Загрузка...</p>;
  if (error) return <p className={s.error}>Ошибка: {error}</p>;
  if (!course) return <p className={s.error}>Курс не найден</p>;

  return (
    <div className={s.page}>
      <div className={s.preview} style={{ background: course.previewGradient }}>
        <span className={s.levelBadge}>{LEVEL_LABEL[course.level]}</span>
      </div>

      <h1 className={s.title}>{course.title}</h1>

      <div className={s.author}>
        <Avatar name={course.authorName} size={40} />
        <span className={s.authorName}>{course.authorName}</span>
      </div>

      <div className={s.priceRow}>
        <span className={s.price}>{course.price} ₽</span>
        <button type="button" className={s.buy}>
          Купить курс
        </button>
      </div>

      <div className={s.specs}>
        <div className={s.spec}>
          <span className={s.specLabel}>Стиль</span>
          <span className={s.specValue}>{course.style}</span>
        </div>

        <div className={s.spec}>
          <span className={s.specLabel}>Уровень</span>
          <span className={s.specValue}>{LEVEL_LABEL[course.level]}</span>
        </div>

        <div className={s.spec}>
          <span className={s.specLabel}>Уроков</span>
          <span className={s.specValue}>{course.lessons}</span>
        </div>

        <div className={s.spec}>
          <span className={s.specLabel}>Длительность</span>
          <span className={s.specValue}>{course.duration}</span>
        </div>

        {course.hasCertificate && (
          <div className={s.spec}>
            <span className={s.specLabel}>Сертификат</span>
            <span className={s.specValue}>Да</span>
          </div>
        )}
      </div>
    </div>
  );
}