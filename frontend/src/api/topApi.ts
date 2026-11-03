import { http } from "./http";

export interface TopAuthorDto {
  place: number;
  name: string;
  points: number;
  delta: number;
  rankLabel: string;
  isMe?: boolean;
  nextPlace?: number;
  nextName?: string;
  nextPoints?: number;
  totalParticipants?: number;
}

export interface TopResponseDto {
  authors: TopAuthorDto[];
  me: TopAuthorDto | null;
}

export async function fetchTop(): Promise<TopResponseDto> {
  const token = localStorage.getItem("gs:token");

  const { data } = await http.get<TopResponseDto>("/top", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}