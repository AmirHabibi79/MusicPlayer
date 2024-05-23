import useSelectedSong from "../hooks/useSelectedSong";
import useSongs from "../hooks/useSongs";

export default function SongList() {
  const [songs] = useSongs();
  const [, setSelected] = useSelectedSong();
  const click = (Id: number) => {
    setSelected(songs.filter((s) => s.Id === Id)[0]);
  };
  return (
    <div className="flex gap-2 flex-nowrap overflow-auto">
      {songs.length === 0 && <span>there is no songs</span>}
      {songs.map((song) => (
        <div
          onClick={() => click(song.Id)}
          className="flex flex-col flex-shrink-0"
          key={song.Id}
        >
          <img className="w-[80px] h-[80px]" src={song.Cover} alt={song.Name} />
          <span>{song.Name}</span>
          <span>{song.Artist}</span>
        </div>
      ))}
    </div>
  );
}
