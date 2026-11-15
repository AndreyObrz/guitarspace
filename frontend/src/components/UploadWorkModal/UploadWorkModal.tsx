import { useState, type FormEvent } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { http } from "@/api/http";
import { useAuth } from "@/context/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadWorkModal({ open, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [tag, setTag] = useState("tab");
  const [style, setStyle] = useState("Fingerstyle");
  const [level, setLevel] = useState("beginner");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await http.post("/works", {
        title,
        authorName: user?.name ?? "Гость",
        price: Number(price),
        tag,
        style,
        level,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Ошибка загрузки");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Загрузить работу</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          {error && <div style={{ color: "#f87171" }}>{error}</div>}

          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Цена (₽)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            fullWidth
          />
          <TextField
            select
            label="Тип"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            fullWidth
          >
            <MenuItem value="tab">Таб</MenuItem>
            <MenuItem value="arrangement">Аранжировка</MenuItem>
            <MenuItem value="tab_video">Таб + видео</MenuItem>
          </TextField>
          <TextField
            select
            label="Стиль"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            fullWidth
          >
            <MenuItem value="Fingerstyle">Fingerstyle</MenuItem>
            <MenuItem value="Джаз">Джаз</MenuItem>
            <MenuItem value="Рок">Рок</MenuItem>
            <MenuItem value="Классическая музыка">Классическая музыка</MenuItem>
          </TextField>
          <TextField
            select
            label="Уровень"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
          >
            <MenuItem value="beginner">Начальный</MenuItem>
            <MenuItem value="intermediate">Средний</MenuItem>
            <MenuItem value="advanced">Продвинутый</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? "Загрузка..." : "Загрузить"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}