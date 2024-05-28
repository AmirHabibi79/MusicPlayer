import { useRecoilState } from "recoil";
import { PlaylistAtom } from "../store";
import { Playlist } from "../types/playlist";

export default function usePlaylist() {
  const [playlists, setPlaylists] = useRecoilState(PlaylistAtom);
  const addPlayList = (Name: string) => {
    const newPlaylist: Playlist = {
      Id: playlists.length - 1,
      Name,
      Songs: [],
    };
    setPlaylists((pre) => [...pre, newPlaylist]);
  };
  const removePlayList = (Id: number) => {
    setPlaylists((pre) => [...pre.filter((p) => p.Id !== Id)]);
  };
  return { playlists, addPlayList, removePlayList };
}
