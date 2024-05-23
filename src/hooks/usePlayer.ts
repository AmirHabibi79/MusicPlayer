import { useRecoilState, useRecoilCallback } from "recoil";
import {
  isPlayingAtom,
  DurationAtom,
  CurrentTimeAtom,
  LoopAtom,
  isSeekingAtom,
  VolumeAtom,
  BufferAtom,
} from "../store/index";
import { clamp } from "../helper/utils";
import useSongs from "./useSongs";
import useSelectedSong from "./useSelectedSong";
export default function usePlayer() {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const [currentTime, setCurrentTime] = useRecoilState(CurrentTimeAtom);
  const [duration, setDuration] = useRecoilState(DurationAtom);
  const [loop, setloop] = useRecoilState(LoopAtom);
  const [isSeek, setIsSeek] = useRecoilState(isSeekingAtom);
  const [volume, setVolume] = useRecoilState(VolumeAtom);
  const [buffer, setBuffer] = useRecoilState(BufferAtom);
  const [songs] = useSongs();
  const [selected, setSelcted] = useSelectedSong();
  const pause = () => {
    setIsPlaying(false);
  };
  const play = () => {
    setIsPlaying(true);
  };
  const changeLoop = () => {
    setloop((pre) => !pre);
  };
  const changeVolume = (v: number) => {
    const clampedV = clamp(v, 0, 1);
    setVolume(clampedV);
  };

  const changeBuffer = useRecoilCallback(
    ({ snapshot }) =>
      (bufferedEnd: number) => {
        const d = snapshot.getLoadable(DurationAtom).contents;
        const bufferAmount = d === 0 ? 0 : (bufferedEnd / d) * 100;
        setBuffer(bufferAmount);
      }
  );
  const nextSong = () => {
    if (selected === null) {
      setSelcted(songs[0]);
      return;
    }
    const selectedIndex = songs.indexOf(selected);
    if (selectedIndex + 1 > songs.length - 1) {
      setSelcted(songs[0]);
    } else {
      setSelcted(songs[selectedIndex + 1]);
    }
  };
  const preSong = () => {
    if (selected === null) {
      setSelcted(songs[songs.length - 1]);
      return;
    }
    const selectedIndex = songs.indexOf(selected);
    if (selectedIndex - 1 < 0) {
      setSelcted(songs[songs.length - 1]);
    } else {
      setSelcted(songs[selectedIndex - 1]);
    }
  };
  return {
    isPlaying,
    play,
    pause,
    currentTime,
    duration,
    setCurrentTime,
    setDuration,
    loop,
    changeLoop,
    isSeek,
    setIsSeek,
    volume,
    changeVolume,
    buffer,
    changeBuffer,
    nextSong,
    preSong,
  };
}
