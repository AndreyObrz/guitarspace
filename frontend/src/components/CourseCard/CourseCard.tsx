import { Link } from "react-router-dom";
import s from "./CourseCard.module.css";
import { Avatar } from "@/components/ui";
import type { CourseDto } from "@/api/coursesApi";

const LEVEL_LABEL: Record<CourseDto["level"], string> = {
  beginner: "НАЧАЛЬНЫЙ",
  intermediate: "СРЕДНИЙ",
  advanced: "ПРОДВИНУТЫЙ",
};

interface CourseCardProps {
  course: CourseDto;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/course/${course.id}`} className={s.card}>
      <div className={s.preview} style={{ background: course.previewGradient }}>
        <span className={s.levelBadge}>{LEVEL_LABEL[course.level]}</span>
        <span className={s.rating}>⭐ 4.9</span>
      </div>

      <div className={s.body}>
        <h3 className={s.title}>{course.title}</h3>

        <div className={s.author}>
          <Avatar name={course.authorName} size={24} />
          <span className={s.authorName}>{course.authorName}</span>
        </div>

        <div className={s.meta}>
          {course.lessons} уроков · {course.duration}
        </div>

        <div className={s.footer}>
          <span className={s.price}>{course.price} ₽</span>
          <button type="button" className={s.buy}>
            Купить
          </button>
        </div>
      </div>
    </Link>
  );
}
