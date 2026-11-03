import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import s from "./RegisterPage.module.css";
import { useAuth } from "@/context/auth";

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await signUp(email, password, name || undefined);
      navigate("/feed");
    } catch (err) {
      setError((err as Error).message || "Ошибка регистрации");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.page}>
      <form className={s.card} onSubmit={handleSubmit}>
        <h1 className={s.title}>Регистрация</h1>
        <p className={s.subtitle}>Создайте аккаунт в GuitarSpace</p>

        {error && <div className={s.error}>{error}</div>}

        <div className={s.field}>
          <label className={s.label}>Имя</label>
          <input
            className={s.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            autoComplete="name"
          />
        </div>

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
            placeholder="Минимум 6 символов"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <button className={s.submit} type="submit" disabled={busy}>
          {busy ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <div className={s.footer}>
          Уже есть аккаунт? <Link to="/login" className={s.link}>Войти</Link>
        </div>
      </form>
    </div>
  );
}