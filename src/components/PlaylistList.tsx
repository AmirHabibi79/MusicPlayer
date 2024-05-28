import { LegacyRef, useRef } from "react";
import usePlaylist from "../hooks/usePlaylist";
import AddPlaylistModal from "./AddPlaylistModal";

export default function PlaylistList() {
  const { playlists, addPlayList } = usePlaylist();
  const nameRef = useRef<HTMLInputElement>();
  return (
    <div className="flex flex-col gap-1">
      {playlists.length === 0 && <span>there is no playlist</span>}
      {playlists.map((playlist) => (
        <div
          className="flex flex-col gap-1 border-black border-[0.5px]"
          key={playlist.Id}
        >
          <span>{playlist.Name}</span>
          <span>amount: {playlist.Songs.length}</span>
        </div>
      ))}
      <AddPlaylistModal />
    </div>
  );
}
