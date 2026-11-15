import { http } from "./http";

// ─── Общие поля для работ (табы, аранжировки, видео) ───
interface BaseWork {
  id: string;
  title: string;
  authorName: string;
  price: number;
  previewGradient: string;
  style: string;
  level: "beginner" | "intermediate" | "advanced" | "any";
}

// ─── Таб ───
export interface TabDto extends BaseWork {
  tag: "tab";
  instrument: "6-string" | "7-string" | "classical" | "bass" | "electric";
  pages: number;
  tuning?: string;
  hasGtp?: boolean;
}

// ─── Аранжировка ───
export interface ArrangementDto extends BaseWork {
  tag: "arrangement";
  instruments: string[];
  partsCount: number;
}

// ─── Таб + видео ───
export interface TabVideoDto extends BaseWork {
  tag: "tab_video";
  instrument: string;
  videoDuration: number;
  pages: number;
}

// ─── Объединение: работа — это ОДИН из этих типов ───
export type WorkDto = TabDto | ArrangementDto | TabVideoDto;

// ─── Ответ сервера ───
export interface WorksResponseDto {
  items: WorkDto[];
  page: number;
  total: number;
}

// ─── Запрос ───
export async function fetchWorks(page = 1): Promise<WorksResponseDto> {
  const { data } = await http.get<WorksResponseDto>("/works", {
    params: { page },
  });
  return data;
}

export async function fetchWorkById(id: string): Promise<WorkDto> {
  const { data } = await http.get<WorkDto>(`/works/${id}`);
  return data;
}

// ─── Создание работы (с токеном) ───
export async function createWork(data: {
  title: string;
  authorName: string;
  price: number;
  tag: string;
  style: string;
  level: string;
  instrument?: string;
  pages?: number;
}): Promise<WorkDto> {
  const token = localStorage.getItem("gs:token");
  const { data: res } = await http.post<WorkDto>("/works", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res;
}

// ─── Удаление работы (с токеном) ───
export async function deleteWork(id: string): Promise<void> {
  const token = localStorage.getItem("gs:token");
  await http.delete(`/works/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}