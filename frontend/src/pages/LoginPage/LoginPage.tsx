import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import s from "./LoginPage.module.css";
import { useAuth } from "@/context/auth";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await signIn(email, password);
      navigate("/feed");
    } catch (err) {
      setError((err as Error).message || "Ошибка входа");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.page}>
      <form className={s.card} onSubmit={handleSubmit}>
        <h1 className={s.title}>Вход</h1>
        <p className={s.subtitle}>Войдите в GuitarSpace</p>

        {error && <div className={s.error}>{error}</div>}

        <div className={s.field}>
          <label className={s.label}>Email</label>
          <input
            className={s.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>Пароль</label>
          <input
            className={s.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button className={s.submit} type="submit" disabled={busy}>
          {busy ? "Вход..." : "Войти"}
        </button>

        <div className={s.footer}>
          Нет аккаунта? <Link to="/register" className={s.link}>Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}