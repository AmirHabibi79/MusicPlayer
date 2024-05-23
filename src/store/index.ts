import { Songs, selectedSong } from "./song";
import {
  isPlaying,
  currentTime,
  duration,
  loop,
  isSeeking,
  volume,
  buffer,
} from "./player";

export {
  Songs as SongsAtom,
  selectedSong as SelectedAtom,
  isPlaying as isPlayingAtom,
  currentTime as CurrentTimeAtom,
  duration as DurationAtom,
  loop as LoopAtom,
  isSeeking as isSeekingAtom,
  volume as VolumeAtom,
  buffer as BufferAtom,
};
