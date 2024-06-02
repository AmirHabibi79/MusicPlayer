import { atom, selector } from "recoil";
import { Playlist } from "../types/playlist";
import { SongsAtom } from ".";
import { Song } from "../types/Song";
export const ALLSONG_PLAYLIST_DEFAULT = "allsong_playlist_default";
const isAddingSong = atom({
  key: "isAddingSong",
  default: false,
});

const selectedPlaylistToEdit = atom<Playlist | null>({
  key: "selectedPlaylistToEdit",
  default: null,
});
const selectedPlaylistToPlayId = atom<number>({
  key: "selectedPlaylistToPlay",
  default: 1,
});

const playlists = atom<Playlist[]>({
  key: "playlists",
  default: [],
});

const getPlaylists = selector<Playlist[]>({
  key: "getPlaylists",
  get: ({ get }) => {
    const songs = get(SongsAtom);
    const allPlaylists = get(playlists);
    return [
      { Id: 1, Name: ALLSONG_PLAYLIST_DEFAULT, Songs: songs },
      ...allPlaylists,
    ];
  },
});

const getSongsFromSelectedPlaylist = selector<Song[]>({
  key: "getSongsFromSelectedPlaylist",
  get: ({ get }) => {
    const playlistToPlayId = get(selectedPlaylistToPlayId);
    const allPlaylists = get(getPlaylists);
    return allPlaylists.filter((a) => a.Id === playlistToPlayId)[0].Songs;
  },
});

export {
  playlists,
  getPlaylists,
  isAddingSong,
  selectedPlaylistToEdit,
  selectedPlaylistToPlayId,
  getSongsFromSelectedPlaylist,
};
