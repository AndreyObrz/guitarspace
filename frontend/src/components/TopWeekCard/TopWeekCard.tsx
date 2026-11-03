import clsx from "clsx";
import s from "./TopWeekCard.module.css";
import { Avatar } from "@/components/ui";

export interface TopWeekAuthor {
  place: number;
  name: string;
  points: number;
  delta: number;
  isMe?: boolean;
}

interface TopWeekCardProps {
  authors: TopWeekAuthor[];
}

export function TopWeekCard({ authors }: TopWeekCardProps) {
  return (
    <div className={s.card}>
      <div className={s.head}>
        <span className={s.title}>Топ недели</span>
        <button type="button" className={s.link}>Весь топ</button>
      </div>

      <div className={s.list}>
        {authors.map((a, i) => {
          const deltaClass =
            a.delta > 0 ? s.deltaUp : a.delta < 0 ? s.deltaDown : s.deltaFlat;
          const deltaLabel =
            a.delta > 0 ? `+${a.delta}` : a.delta < 0 ? `${a.delta}` : "0";

          const prev = authors[i - 1];
          const showDivider = a.isMe && prev && a.place - prev.place > 1;

          return (
            <div key={a.place}>
              {showDivider && <div className={s.divider}>···</div>}
              <div className={clsx(s.row, a.isMe && s.rowMe)}>
                <span className={clsx(s.place, a.place <= 3 && s.placeTop)}>
                  {a.place}
                </span>
                <span className={s.avatarWrap}>
                  <Avatar name={a.name} size={32} />
                </span>
                <div className={s.info}>
                  <div className={s.name}>
                    {a.name}
                    {a.isMe && <span className={s.youBadge}> — вы</span>}
                  </div>
                  <div className={s.points}>
                    {a.points.toLocaleString("ru")} очков
                  </div>
                </div>
                <span className={clsx(s.delta, deltaClass)}>{deltaLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}