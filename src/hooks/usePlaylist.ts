import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import {
  PlaylistAtom,
  IsAddingSongToPlaylistAtom,
  SelectedPlaylistToEditAtom,
  GetPlaylistSelector,
  SelectedPlaylistToPlayIdAtom,
  GetSongsFromSelectedPlaylistSelector,
} from "../store";
import { Playlist } from "../types/playlist";
import useSongs from "./useSongs";
import { cloneDeep } from "../helper/utils";

export default function usePlaylist() {
  const { getSongById } = useSongs();
  const allPlaylists = useRecoilValue(GetPlaylistSelector);
  const songsFromSelectedPlaylist = useRecoilValue(
    GetSongsFromSelectedPlaylistSelector
  );

  const [playlists, setPlaylists] = useRecoilState(PlaylistAtom);
  const [playlistToPlayId, setPlaylistToPlayId] = useRecoilState(
    SelectedPlaylistToPlayIdAtom
  );

  const [isAddingSong, setIsAddingSong] = useRecoilState(
    IsAddingSongToPlaylistAtom
  );
  const [selectedPlaylistToEdit, setSelectedPlaylistToEdit] = useRecoilState(
    SelectedPlaylistToEditAtom
  );

  const addSongToPlaylist = useRecoilCallback(
    ({ snapshot }) =>
      (SongId: number) => {
        const playlist = cloneDeep(
          snapshot.getLoadable(SelectedPlaylistToEditAtom).contents
        ) as Playlist | null;
        if (playlist === null) return;
        const song = getSongById(SongId);
        playlist.Songs.push(song);
        setSelectedPlaylistToEdit(playlist);
        setPlaylists((pre) => {
          const filterPre = pre.filter((p) => p.Id !== playlist.Id);
          filterPre.push(playlist);
          return filterPre;
        });
      },
    [selectedPlaylistToEdit]
  );
  const removeSongFromPlaylist = useRecoilCallback(
    ({ snapshot }) =>
      (SongId: number) => {
        const playlist = cloneDeep(
          snapshot.getLoadable(SelectedPlaylistToEditAtom).contents
        ) as Playlist | null;
        if (playlist === null) return;
        const selectedSong = getSongById(SongId);
        playlist.Songs = playlist.Songs.filter(
          (song) => song.Id !== selectedSong.Id
        );
        setSelectedPlaylistToEdit(playlist);
        setPlaylists((pre) => {
          const filterPre = pre.filter((p) => p.Id !== playlist.Id);
          filterPre.push(playlist);
          return filterPre;
        });
      },
    [selectedPlaylistToEdit]
  );

  const changeIsAddingSong = useRecoilCallback(
    ({ snapshot }) =>
      (PlaylistId?: number) => {
        if (PlaylistId === undefined) {
          setIsAddingSong(false);
          setSelectedPlaylistToEdit(null);
          return;
        }
        const isAdding = snapshot.getLoadable(IsAddingSongToPlaylistAtom)
          .contents as boolean;
        if (isAdding) {
          setIsAddingSong(false);
          setSelectedPlaylistToEdit(null);
        } else {
          setIsAddingSong(true);
          changeSelectedPlaylistToEdit(PlaylistId);
        }
      },
    [isAddingSong]
  );
  const changeSelectedPlaylistToEdit = (PlaylistId: number) => {
    const playlist = getPlaylistById(PlaylistId);
    setSelectedPlaylistToEdit(playlist);
  };
  const getPlaylistById = useRecoilCallback(
    ({ snapshot }) =>
      (Id: number) => {
        const allPlaylists = snapshot.getLoadable(PlaylistAtom)
          .contents as Playlist[];
        return allPlaylists.filter((playlist) => playlist.Id === Id)[0];
      },
    [playlists]
  );

  const addPlayList = (Name: string) => {
    const newPlaylist: Playlist = {
      Id: playlists.length + 1,
      Name,
      Songs: [],
    };
    setPlaylists((pre) => [...pre, newPlaylist]);
  };
  const removePlayList = (Id: number) => {
    setPlaylists((pre) => [...pre.filter((p) => p.Id !== Id)]);
  };
  return {
    playlists,
    addPlayList,
    removePlayList,
    changeIsAddingSong,
    isAddingSong,
    selectedPlaylistToEdit,
    changeSelectedPlaylistToEdit,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    allPlaylists,
    playlistToPlayId,
    setPlaylistToPlayId,
    songsFromSelectedPlaylist,
  };
}
