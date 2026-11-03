import { http } from "./http";

// ─── Курс — отдельная сущность ───
export interface CourseDto {
  id: string;
  tag: "course";
  title: string;
  authorName: string;
  price: number;
  previewGradient: string;
  style: string;
  level: "beginner" | "intermediate" | "advanced";
  lessons: number;
  duration: string;
  hasCertificate?: boolean;
}

// ─── Ответ сервера ───
export interface CoursesResponseDto {
  items: CourseDto[];
  page: number;
  total: number;
}

// ─── Запрос ───
export async function fetchCourses(page = 1): Promise<CoursesResponseDto> {
  const { data } = await http.get<CoursesResponseDto>("/courses", {
    params: { page },
  });
  return data;
}

export async function fetchCourseById(id: string): Promise<CourseDto> {
  const { data } = await http.get<CourseDto>(`/courses/${id}`);
  return data;
}