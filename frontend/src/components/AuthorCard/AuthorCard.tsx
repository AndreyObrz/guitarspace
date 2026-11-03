import s from "./AuthorCard.module.css";
import { Avatar } from "@/components/ui";

export interface AuthorCardProps {
  name: string;
  style: string;
  points: number;
}

export function AuthorCard({ name, style, points }: AuthorCardProps) {
  return (
    <div className={s.card}>
      <span className={s.avatarWrap}>
        <Avatar name={name} size={40} />
      </span>
      <div className={s.info}>
        <div className={s.name}>{name}</div>
        <div className={s.style}>{style}</div>
        <div className={s.points}>{points.toLocaleString("ru")} очков</div>
      </div>
      <button type="button" className={s.follow} aria-label="Подписаться">
        +
      </button>
    </div>
  );
}