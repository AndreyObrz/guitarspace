import s from "./AuthorsList.module.css";
import { AuthorCard, type AuthorCardProps } from "@/components/AuthorCard";

interface AuthorsListProps {
  authors: AuthorCardProps[];
}

export function AuthorsList({ authors }: AuthorsListProps) {
  return (
    <div className={s.block}>
      <div className={s.head}>
        <span className={s.title}>Авторы вашего стиля</span>
      </div>
      <div className={s.list}>
        {authors.map((a, i) => (
          <AuthorCard key={i} {...a} />
        ))}
      </div>
    </div>
  );
}