import { SongsAtom } from "../store/index";
import { useRecoilCallback, useRecoilState } from "recoil";
import { Song } from "../types/Song";
export default function useSongs() {
  const [songs, setSongs] = useRecoilState(SongsAtom);
  const getSongsSnapshotContetns = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const Songs = snapshot.getLoadable(SongsAtom).contents as Song[];
        return Songs;
      },
    [SongsAtom]
  );
  const getSongById = useRecoilCallback(
    () => (songId: number) => {
      const Songs = getSongsSnapshotContetns();
      return Songs.filter((song) => song.Id === songId)[0];
    },
    []
  );
  const getSongByIndex = useRecoilCallback(
    () => (index: number) => {
      const Songs = getSongsSnapshotContetns();
      return Songs[index];
    },
    [SongsAtom]
  );
  const getLengthOfSongs = useRecoilCallback(
    () => () => {
      const Songs = getSongsSnapshotContetns();

      return Songs.length;
    },
    [SongsAtom]
  );
  const getFirstSong = useRecoilCallback(
    () => () => {
      const Songs = getSongsSnapshotContetns();

      return Songs[0];
    },
    [SongsAtom]
  );
  const getLastSong = useRecoilCallback(
    () => () => {
      const Songs = getSongsSnapshotContetns();

      return Songs[Songs.length - 1];
    },
    [SongsAtom]
  );
  const getIndexOfSongBySong = useRecoilCallback(
    () => (song: Song) => {
      const Songs = getSongsSnapshotContetns();

      return Songs.indexOf(song);
    },
    [SongsAtom]
  );
  return {
    songs,
    setSongs,
    getSongById,
    getFirstSong,
    getLastSong,
    getLengthOfSongs,
    getIndexOfSongBySong,
    getSongByIndex,
  };
}
