import { LegacyRef, useRef, useEffect } from "react";
import useSelectedSong from "../hooks/useSelectedSong";
import usePlayer from "../hooks/usePlayer";
import { getDisplayTimeBySeconds } from "../helper/utils.ts";
import { Slider, LinearProgress } from "@mui/material";

export default function Player() {
  const [selected] = useSelectedSong();
  const {
    isPlaying,
    play,
    pause,
    currentTime,
    duration,
    setDuration,
    setCurrentTime,
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
  } = usePlayer();
  const setBuffer = () => {
    const bufferedEnd = playerRef.current?.buffered.end(
      playerRef.current?.buffered.length - 1
    ) as number;
    changeBuffer(bufferedEnd);
  };
  const playerRef = useRef<HTMLAudioElement>();
  useEffect(() => {
    if (isPlaying == false) {
      playerRef?.current?.pause();
    } else {
      playerRef?.current?.play();
    }
  }, [isPlaying]);
  useEffect(() => {
    playerRef.current!.volume = volume;
  }, [volume]);
  return (
    <div className="h-[300px]">
      <audio
        ref={playerRef as LegacyRef<HTMLAudioElement>}
        src={selected?.Link}
        autoPlay={isPlaying}
        onTimeUpdate={() => {
          if (isSeek) return;
          setCurrentTime(playerRef?.current?.currentTime as number);
        }}
        onLoadedMetadata={() => {
          setDuration(playerRef?.current?.duration as number);
          setBuffer();
        }}
        loop={loop}
        onProgress={setBuffer}
      />
      <div className="flex flex-col gap-2 h-full">
        <button onClick={play}>play</button>
        <button onClick={pause}>pause</button>
        <button onClick={changeLoop}>changeLoop</button>
        <button onClick={nextSong}>next</button>
        <button onClick={preSong}>pre</button>
        <span>current: {getDisplayTimeBySeconds(currentTime)}</span>
        <span>duration: {getDisplayTimeBySeconds(duration)}</span>
        <Slider
          value={currentTime}
          max={duration}
          onChange={(_, v) => {
            setIsSeek(true);
            setCurrentTime(v as number);
          }}
          onChangeCommitted={() => {
            setIsSeek(false);
            playerRef.current!.currentTime = currentTime as number;
          }}
        />
        <LinearProgress variant="buffer" value={0} valueBuffer={buffer} />
        <Slider
          value={volume}
          onChange={(_, v) => {
            changeVolume(v as number);
          }}
          sx={{
            '& input[type="range"]': {
              WebkitAppearance: "slider-vertical",
            },
          }}
          min={0}
          step={0.1}
          max={1}
          orientation="vertical"
        />
      </div>
    </div>
  );
}
