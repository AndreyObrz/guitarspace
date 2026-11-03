import { http } from "./http";

export interface ProfileDto {
  id: string;
  name: string;
  username: string;
  isTeacher: boolean;
  avatarGradient: string;
  coverGradient: string;
  instruments: string[];
  bio: string;
  links: { youtube?: string; telegram?: string; website?: string };
  stats: {
    points: number;
    rank: number;
    rankLabel: string;
    publications: number;
    earnings: number;
  };
  progress: {
    current: number;
    target: number;
    targetLabel: string;
  };
}

export async function fetchProfile(id: string): Promise<ProfileDto> {
  const { data } = await http.get<ProfileDto>(`/profile/${id}`);
  return data;
}