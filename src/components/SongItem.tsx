import { Song } from "../types/Song";
type Props = {
  song: Song;
  onClick: (Id: number) => void;
};
export default function SongItem({ song, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(song.Id)}
      className="flex flex-col flex-shrink-0"
      key={song.Id}
    >
      <img className="w-[80px] h-[80px]" src={song.Cover} alt={song.Name} />
      <span>{song.Name}</span>
      <span>{song.Artist}</span>
    </div>
  );
}
