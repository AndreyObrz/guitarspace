import { useState, useEffect } from "react";
import clsx from "clsx";
import s from "./Sidebar.module.css";
import {
  GridViewOutlined,
  MusicNoteOutlined,
  SchoolOutlined,
  EmojiEventsOutlined,
  PersonOutlineOutlined,
  ArticleOutlined,
  EditNoteOutlined,
  SellOutlined,
} from "@mui/icons-material";
import { Avatar, ProgressBar } from "@/components/ui";
import { useAuth } from "@/context/auth";
import { fetchProfile, type ProfileDto } from "@/api/profileApi";
import { NavLink } from "react-router-dom";

type NavId = "feed" | "tabs" | "courses" | "top" | "profile";

interface NavItemDef {
  id: NavId;
  label: string;
  icon: typeof GridViewOutlined;
}

const MAIN_NAV: NavItemDef[] = [
  { id: "feed", label: "Лента", icon: GridViewOutlined },
  { id: "tabs", label: "Табы и аранжировки", icon: MusicNoteOutlined },
  { id: "courses", label: "Курсы", icon: SchoolOutlined },
  { id: "top", label: "Топ гитаристов", icon: EmojiEventsOutlined },
  { id: "profile", label: "Профиль", icon: PersonOutlineOutlined },
];

export function Sidebar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileDto | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;
    (async () => {
      try {
        const data = await fetchProfile(user.id);
        if (mounted) setProfile(data);
      } catch {
        // профиль ещё не создан — ок
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const progressPct = profile
    ? Math.round((profile.progress.current / profile.progress.target) * 100)
    : 0;

  return (
    <aside className={s.sidebar}>
      {/* Навигация */}
      <nav className={s.nav}>
        {MAIN_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) =>
                clsx(s.item, isActive && s.itemActive)
              }
            >
              <span className={s.itemIcon}>
                <Icon fontSize="small" />
              </span>
              <span className={s.itemLabel}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Мои работы */}
      <div className={s.sectionTitle}>Мои работы</div>
      <nav className={s.nav}>
        <button type="button" className={s.item}>
          <span className={s.itemIcon}><ArticleOutlined fontSize="small" /></span>
          <span className={s.itemLabel}>Публикации</span>
          <span className={s.itemCount}>{profile?.stats.publications ?? 0}</span>
        </button>
        <button type="button" className={s.item}>
          <span className={s.itemIcon}><EditNoteOutlined fontSize="small" /></span>
          <span className={s.itemLabel}>Черновики</span>
          <span className={s.itemCount}>0</span>
        </button>
        <button type="button" className={s.item}>
          <span className={s.itemIcon}><SellOutlined fontSize="small" /></span>
          <span className={s.itemLabel}>Продажи</span>
          <span className={s.itemCount}>0</span>
        </button>
      </nav>

      {/* Прогресс */}
      <div className={s.progressBlock}>
        <div className={s.progressHead}>
          <span>Мой прогресс</span>
          <span className={s.progressPct}>{progressPct}% до разряда</span>
        </div>
        <div className={s.progressValue}>
          {(profile?.stats.points ?? 0).toLocaleString("ru")} очков
        </div>
        <ProgressBar value={progressPct} />
        <div className={s.progressFoot}>
          До разряда «{profile?.progress.targetLabel ?? "Ученик"}» осталось{" "}
          {profile
            ? (profile.progress.target - profile.progress.current).toLocaleString("ru")
            : 0}{" "}
          очков
        </div>
      </div>

      {/* Продажи и уведомления */}
      <div className={s.sectionTitle}>Продажи и уведомления</div>
      <div className={s.notifList}>
        <div className={s.notif}>
          <span className={s.notifIcon}>🟢</span>
          <span className={s.notifText}>Продан таб «Aurora»</span>
          <span className={s.notifPoints}>+70</span>
        </div>
        <div className={s.notif}>
          <span className={s.notifIcon}>⭐</span>
          <span className={s.notifText}>Новый отзыв 5 из 5</span>
          <span className={s.notifPoints}>+15</span>
        </div>
        <div className={s.notif}>
          <span className={s.notifIcon}>💸</span>
          <span className={s.notifText}>Выплата 12 400 ₽</span>
          <span className={s.notifTextDim}>отправлена</span>
        </div>
      </div>

      {/* Карточка профиля */}
      <div className={s.userCard}>
        <Avatar name={profile?.name ?? user?.name ?? "Гость"} size={40} />
        <div className={s.userInfo}>
          <div className={s.userName}>
            {profile?.name ?? user?.name ?? "Гость"}
          </div>
          <div className={s.userRank}>
            Разряд: {profile?.stats.rankLabel ?? "—"}
          </div>
        </div>
      </div>
    </aside>
  );
}