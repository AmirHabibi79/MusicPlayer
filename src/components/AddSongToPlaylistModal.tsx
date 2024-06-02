import React from "react";
import usePlaylist from "../hooks/usePlaylist";
import useSongs from "../hooks/useSongs";
import CustomModal from "./CustomModal";
import SongItem from "./SongItem";

export default function AddSongToPlaylistModal() {
  const { songs } = useSongs();
  const {
    isAddingSong,
    selectedPlaylistToEdit,
    changeIsAddingSong,
    addSongToPlaylist,
    removeSongFromPlaylist,
  } = usePlaylist();
  const removeSong = (Id: number) => {
    removeSongFromPlaylist(Id);
    // setAllSongs((pre) => {
    //   pre.push(getSongById(Id));
    //   return pre;
    // });
  };
  const addSong = (Id: number) => {
    addSongToPlaylist(Id);
    // setAllSongs((pre) => [...pre.filter((p) => p.Id !== Id)]);
  };
  return (
    //TODO:fix when closing everything disappear
    //after transitionend remove the data
    <CustomModal open={isAddingSong} onClose={() => changeIsAddingSong()}>
      <div className="flex flex-col bg-white p-2">
        <span>{selectedPlaylistToEdit?.Name}</span>
        <span>playlist's songs</span>
        <div className="flex flex-col gap-1">
          {selectedPlaylistToEdit?.Songs.map((song) => (
            <SongItem key={song.Id} song={song} onClick={removeSong} />
          ))}
        </div>
        <span>all songs</span>
        <div className="flex flex-col gap-1">
          {songs.map((song) => (
            <React.Fragment key={song.Id}>
              {
                //TODO:get the diffrence of all song and this playlists' song from selector
              }
              {!selectedPlaylistToEdit?.Songs.some((s) => s.Id == song.Id) && (
                <SongItem song={song} onClick={addSong} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </CustomModal>
  );
}
