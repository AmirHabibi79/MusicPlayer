import usePlaylist from "../hooks/usePlaylist";
import { ALLSONG_PLAYLIST_DEFAULT } from "../store/playlist";
import AddPlaylistModal from "./AddPlaylistModal";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";

export default function PlaylistList() {
  const { allPlaylists, changeIsAddingSong, setPlaylistToPlayId } =
    usePlaylist();
  const click = (playlistId: number) => {
    changeIsAddingSong(playlistId);
  };
  return (
    <div className="flex flex-col gap-1">
      {allPlaylists.filter((p) => p.Name !== ALLSONG_PLAYLIST_DEFAULT)
        .length === 0 && <span>there is no playlist</span>}
      {allPlaylists
        .filter((p) => p.Name !== ALLSONG_PLAYLIST_DEFAULT)
        .map((playlist) => (
          <div
            className="flex items-center justify-between gap-1 border-black border-[0.5px]"
            key={playlist.Id}
          >
            <div className="flex flex-col gap-1">
              <span>{playlist.Name}</span>
              <span>amount: {playlist.Songs.length}</span>
            </div>
            <button onClick={() => setPlaylistToPlayId(playlist.Id)}>
              play
            </button>
            <button onClick={() => click(playlist.Id)}>add song</button>
          </div>
        ))}
      <AddPlaylistModal />
      <AddSongToPlaylistModal />
    </div>
  );
}
