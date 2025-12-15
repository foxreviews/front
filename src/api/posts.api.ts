import { http } from "./http";
import type { Post } from "../types/api";

export const getPosts = async (): Promise<Post[]> => {
  const res = await http.get<Post[]>("/posts");
  return res.data;
};
