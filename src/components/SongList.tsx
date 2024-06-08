import useSongs from "../hooks/useSongs";
import usePlayer from "../hooks/usePlayer";
import SongItem from "./SongItem";

export default function SongList() {
  const { songs } = useSongs();
  const { selectSongAndPlay } = usePlayer();

  const click = (Id: number) => {
    //setSelected(songs.filter((s) => s.Id === Id)[0]);
    selectSongAndPlay(Id);
  };

  return (
    <>
      <span>my songs</span>
      <div className="flex gap-2 flex-nowrap overflow-auto">
        {songs.length === 0 && <span>there is no songs</span>}

        {songs.map((song) => (
          <SongItem key={song.Id} song={song} onClick={click} />
        ))}
      </div>
    </>
  );
}
