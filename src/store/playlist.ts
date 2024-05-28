import { atom } from "recoil";
import { Playlist } from "../types/playlist";

const playlists = atom<Playlist[]>({
  key: "playlists",
  default: [],
});

export { playlists };
