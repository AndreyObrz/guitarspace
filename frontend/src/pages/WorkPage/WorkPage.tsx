import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import s from "./WorkPage.module.css";
import { Avatar } from "@/components/ui";
import { fetchWorkById, deleteWork, type WorkDto } from "@/api/worksApi";
import { useAuth } from "@/context/auth";

const TAG_LABEL: Record<WorkDto["tag"], string> = {
  tab: "ТАБ",
  arrangement: "АРАНЖИРОВКА",
  tab_video: "ТАБ + ВИДЕО",
};

export function WorkPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [work, setWork] = useState<WorkDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchWorkById(id);
        if (mounted) setWork(data);
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
  if (!work) return <p className={s.error}>Работа не найдена</p>;

  const isFree = work.price === 0;

  const handleDelete = async () => {
    if (!confirm("Удалить работу?")) return;
    try {
      await deleteWork(work.id);
      navigate("/feed");
    } catch (e) {
      alert((e as Error).message || "Ошибка удаления");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.preview} style={{ background: work.previewGradient }}>
        <span className={s.tag}>{TAG_LABEL[work.tag]}</span>
      </div>

      <h1 className={s.title}>{work.title}</h1>

      <div className={s.author}>
        <Avatar name={work.authorName} size={40} />
        <span className={s.authorName}>{work.authorName}</span>
      </div>

      <div className={s.priceRow}>
        <span className={s.price}>{isFree ? "Бесплатно" : `${work.price} ₽`}</span>
        <button
          type="button"
          className={isFree ? `${s.buy} ${s.buyFree}` : s.buy}
        >
          {isFree ? "Скачать" : "Купить"}
        </button>

        {user?.name === work.authorName && (
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: "12px 24px",
              borderRadius: 999,
              border: "1px solid #ef4444",
              background: "transparent",
              color: "#ef4444",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Удалить
          </button>
        )}
      </div>

      <div className={s.specs}>
        <div className={s.spec}>
          <span className={s.specLabel}>Стиль</span>
          <span className={s.specValue}>{work.style}</span>
        </div>

        <div className={s.spec}>
          <span className={s.specLabel}>Уровень</span>
          <span className={s.specValue}>
            {work.level === "beginner"
              ? "Начальный"
              : work.level === "intermediate"
              ? "Средний"
              : work.level === "advanced"
              ? "Продвинутый"
              : "Любой"}
          </span>
        </div>

        {work.tag === "tab" && (
          <>
            <div className={s.spec}>
              <span className={s.specLabel}>Инструмент</span>
              <span className={s.specValue}>{work.instrument}</span>
            </div>
            <div className={s.spec}>
              <span className={s.specLabel}>Страниц</span>
              <span className={s.specValue}>{work.pages}</span>
            </div>
          </>
        )}

        {work.tag === "arrangement" && (
          <div className={s.spec}>
            <span className={s.specLabel}>Партий</span>
            <span className={s.specValue}>{work.partsCount}</span>
          </div>
        )}

        {work.tag === "tab_video" && (
          <div className={s.spec}>
            <span className={s.specLabel}>Видео</span>
            <span className={s.specValue}>
              {Math.floor(work.videoDuration / 60)} мин
            </span>
          </div>
        )}
      </div>
    </div>
  );
}