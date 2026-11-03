import { useEffect, useState } from "react";
import clsx from "clsx";
import s from "./ProfilePage.module.css";
import { Avatar, ProgressBar } from "@/components/ui";
import { WorkCard } from "@/components/WorkCard";
import { fetchProfile, type ProfileDto } from "@/api/profileApi";
import { fetchWorks, type WorkDto } from "@/api/worksApi";
import { useAuth } from "@/context/auth";

const TABS = [
  { id: "all", label: "Все" },
  { id: "arrangement", label: "Аранжировки" },
  { id: "tab", label: "Табы" },
  { id: "tab_video", label: "Видео" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [works, setWorks] = useState<WorkDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [profileData, worksData] = await Promise.all([
          fetchProfile(user?.id ?? "me"),
          fetchWorks(1),
        ]);
        if (mounted) {
          setProfile(profileData);
          setWorks(worksData.items);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  if (loading || !profile) return <p className={s.loading}>Загрузка...</p>;

  const visible = tab === "all" ? works : works.filter((w) => w.tag === tab);

  const progressPct = Math.round(
    (profile.progress.current / profile.progress.target) * 100
  );

  return (
    <div className={s.page}>
      <div className={s.cover} style={{ background: profile.coverGradient }}>
        <button className={s.coverBtn} type="button" aria-label="Сменить обложку">
          📷
        </button>
      </div>

      <div className={s.head}>
        <div className={s.avatarWrap}>
          <Avatar name={profile.name} size={100} />
        </div>
        <div style={{ flex: 1 }}>
          <div className={s.nameRow}>
            <h1 className={s.name}>{profile.name}</h1>
            {profile.isTeacher && <span className={s.badge}>ПРЕПОДАВАТЕЛЬ</span>}
          </div>
          <div className={s.username}>{profile.username}</div>
        </div>
        <div className={s.actions}>
          <button className={s.btnPrimary} type="button">Редактировать профиль</button>
          <button className={s.btnGhost} type="button">Поделиться</button>
        </div>
      </div>

      <div className={s.chips}>
        {profile.instruments.map((inst) => (
          <span key={inst} className={s.chip}>{inst}</span>
        ))}
      </div>

      <p className={s.bio}>{profile.bio}</p>

      <div className={s.links}>
        {profile.links.youtube && <span className={s.link}>📹 {profile.links.youtube}</span>}
        {profile.links.telegram && <span className={s.link}>✈️ {profile.links.telegram}</span>}
        {profile.links.website && <span className={s.link}>🔗 {profile.links.website}</span>}
      </div>

      <div className={s.stats}>
        <div className={s.stat}>
          <span className={s.statValue}>{profile.stats.points.toLocaleString("ru")}</span>
          <span className={s.statLabel}>очков рейтинга</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>№{profile.stats.rank}</span>
          <span className={s.statLabel}>в топе недели</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{profile.stats.rankLabel}</span>
          <span className={s.statLabel}>разряд</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{profile.stats.publications}</span>
          <span className={s.statLabel}>публикаций</span>
        </div>
        <div className={s.stat}>
          <span className={s.statValue}>{profile.stats.earnings.toLocaleString("ru")} ₽</span>
          <span className={s.statLabel}>заработок</span>
        </div>
      </div>

      <div className={s.progressBlock}>
        <div className={s.progressHead}>
          <span>До разряда «{profile.progress.targetLabel}»</span>
          <span>{progressPct}%</span>
        </div>
        <div className={s.progressValue}>
          {profile.progress.current.toLocaleString("ru")} / {profile.progress.target.toLocaleString("ru")}
        </div>
        <ProgressBar value={progressPct} />
      </div>

      <div className={s.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={clsx(s.tab, tab === t.id && s.tabActive)}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.grid}>
        {visible.map((work) => (
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
    </div>
  );
}