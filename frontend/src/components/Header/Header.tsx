import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import s from "./Header.module.css";
import {
  MusicNote,
  Bolt,
  EmojiEvents,
  FileUploadOutlined,
  NotificationsNoneOutlined,
} from "@mui/icons-material";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/context/auth";
import { useEffect } from "react";
import { fetchProfile, type ProfileDto } from "@/api/profileApi";

export function Header() {
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState<ProfileDto | null>(null);

useEffect(() => {
  if (!user?.id) {
    setProfile(null);
    return;
  }

  let mounted = true;
  (async () => {
    try {
      const data = await fetchProfile(user.id);
      if (mounted) setProfile(data);
    } catch {
      // профиль не создан
    }
  })();

  return () => {
    mounted = false;
  };
}, [user?.id]);
  
  const navigate = useNavigate();
  
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleSignOut = () => {
    handleClose();
    signOut();
    navigate("/login");
  };

  return (
    <header className={s.header}>
      <div className={s.row}>
        <NavLink to="/feed" className={s.logo}>
          <div className={s.logoIcon}>
            <MusicNote fontSize="small" />
          </div>
          <span>GuitarSpace</span>
        </NavLink>

        <input
          className={s.search}
          placeholder="Поиск табов, аранжировок, курсов и гитаристов"
          autoComplete="off"
          name="search-field-not-a-login"
        />

        <div className={s.spacer} />

        <div className={s.balance}>
          <Bolt fontSize="small" />
          <span>{(profile?.stats.points ?? 0).toLocaleString("ru")} очков</span>
        </div>

        <div className={s.topN}>
          <EmojiEvents fontSize="small" />
          <span>№{profile?.stats.rank ?? "—"} в тоне</span>
        </div>

        <button className={s.upload} type="button">
          <FileUploadOutlined fontSize="small" />
          <span>Загрузить работу</span>
        </button>

        <button className={s.iconBtn} type="button" aria-label="Уведомления">
          <NotificationsNoneOutlined />
        </button>

        <button
          type="button"
          className={s.avatarBtn}
          onClick={handleAvatarClick}
          aria-label="Меню профиля"
        >
          <Avatar name={user?.name} size={40} />
        </button>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disabled sx={{ fontSize: 13, opacity: "1 !important" }}>
            {user?.name ?? "Гость"}
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Выйти</MenuItem>
        </Menu>
      </div>
    </header>
  );
}