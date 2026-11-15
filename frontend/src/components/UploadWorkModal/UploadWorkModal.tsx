import { useState, type FormEvent } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box,
} from "@mui/material";
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
  const [style, setStyle] = useState("Фингерстайл");
  const [level, setLevel] = useState("beginner");
  const [instrument, setInstrument] = useState("6-string");
  const [pages, setPages] = useState(1);
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
        instrument,
        pages: Number(pages),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.message ||
        "Ошибка загрузки"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
            sx: {
            background: "#1a1a1c",
            border: "1px solid #26262a",
            borderRadius: 4,
            },
        },
        }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700, pb: 1 }}>
          Загрузить работу
        </DialogTitle>
        
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          {error && (
            <Box sx={{ color: "#f87171", fontSize: 14, p: 1, bgcolor: "rgba(239,68,68,0.1)", borderRadius: 2 }}>
              {error}
            </Box>
          )}

          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            sx={inputStyles}
          />

          <TextField
            label="Цена (₽)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            fullWidth
            sx={inputStyles}
          />

          <TextField
            select
            label="Тип"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            fullWidth
            sx={inputStyles}
          >
            <MenuItem value="tab">Табулатура</MenuItem>
            <MenuItem value="arrangement">Аранжировка</MenuItem>
            <MenuItem value="tab_video">Таб + видео</MenuItem>
          </TextField>

          <TextField
            select
            label="Стиль"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            fullWidth
            sx={inputStyles}
          >
            <MenuItem value="Фингерстайл">Фингерстайл</MenuItem>
            <MenuItem value="Джаз">Джаз</MenuItem>
            <MenuItem value="Рок">Рок</MenuItem>
            <MenuItem value="Классическая музыка">Классическая музыка</MenuItem>
            <MenuItem value="Фламенго">Фламенго</MenuItem>
          </TextField>

          <TextField
            select
            label="Уровень"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            fullWidth
            sx={inputStyles}
          >
            <MenuItem value="beginner">Начальный</MenuItem>
            <MenuItem value="intermediate">Средний</MenuItem>
            <MenuItem value="advanced">Продвинутый</MenuItem>
          </TextField>

          <TextField
            select
            label="Инструмент"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            fullWidth
            sx={inputStyles}
          >
            <MenuItem value="6-string">6-струнная</MenuItem>
            <MenuItem value="7-string">7-струнная</MenuItem>
            <MenuItem value="classical">Классика</MenuItem>
            <MenuItem value="bass">Бас-гитара</MenuItem>
            <MenuItem value="electric">Электрогитара</MenuItem>
          </TextField>

          <TextField
            label="Количество страниц"
            type="number"
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
            sx={inputStyles}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose} sx={{ color: "#9aa0a6", textTransform: "none" }}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={busy}
            sx={{
              bgcolor: "#ff6a1a",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              px: 3,
              "&:hover": { bgcolor: "#ff8f4d" },
              "&.Mui-disabled": { bgcolor: "#2f2f34", color: "#6b7280" },
            }}
          >
            {busy ? "Загрузка..." : "Загрузить"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Общие стили для инпутов, чтобы они выглядели как в остальном приложении
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#131315",
    borderRadius: 2,
    color: "#fff",
    "& fieldset": { borderColor: "#26262a" },
    "&:hover fieldset": { borderColor: "#3a3a40" },
    "&.Mui-focused fieldset": { borderColor: "#ff6a1a" },
  },
  "& .MuiInputLabel-root": { color: "#9aa0a6" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#ff6a1a" },
  "& .MuiSelect-icon": { color: "#9aa0a6" },
};