import Player from "./components/Player";
import PlaylistList from "./components/PlaylistList";
import SongList from "./components/SongList";

function App() {
  return (
    <div className="p-2">
      <SongList />
      <Player />
      <PlaylistList />
    </div>
  );
}

export default App;
