import { Song } from "./Song";

export type Playlist = {
  Id: number;
  Name: string;
  Songs: Song[];
};
