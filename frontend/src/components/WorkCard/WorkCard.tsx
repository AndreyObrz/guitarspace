import { Link } from "react-router-dom";
import clsx from "clsx";
import s from "./WorkCard.module.css";
import { Avatar } from "@/components/ui";

export type WorkTag = "tab" | "arrangement" | "tab_video" | "course";

export interface WorkCardProps {
  id: string;
  tag: WorkTag;
  title: string;
  authorName: string;
  price: number;
  previewGradient: string;
}

const TAG_LABEL: Record<WorkTag, string> = {
  tab: "ТАБ",
  arrangement: "АРАНЖИРОВКА",
  tab_video: "ТАБ + ВИДЕО",
  course: "КУРС",
};

export function WorkCard({
  id,
  tag,
  title,
  authorName,
  price,
  previewGradient,
}: WorkCardProps) {
  const isFree = price === 0;

  return (
    <Link to={`/work/${id}`} className={s.cardLink}>
      <article className={s.card}>
        <div className={s.preview} style={{ background: previewGradient }}>
          <span className={s.tag}>{TAG_LABEL[tag]}</span>
        </div>

        <div className={s.body}>
          <h3 className={s.title}>{title}</h3>

          <div className={s.author}>
            <Avatar name={authorName} size={24} />
            <span className={s.authorName}>{authorName}</span>
          </div>

          <div className={s.footer}>
            <span className={s.price}>{isFree ? "Бесплатно" : `${price} ₽`}</span>
            <button
              type="button"
              className={clsx(s.buy, isFree && s.buyFree)}
            >
              {isFree ? "Скачать" : "Купить"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}