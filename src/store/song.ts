import { atom } from "recoil";
import songDate from "../assets/songs.json";
import { Song } from "../types/Song";
const Songs = atom<Song[]>({
  key: "Songs",
  default: songDate,
});

const selectedSong = atom<Song | null>({
  key: "selectedSong",
  default: null,
});

export { Songs, selectedSong };
