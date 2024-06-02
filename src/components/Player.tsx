import { LegacyRef, useRef, useEffect } from "react";
import usePlayer from "../hooks/usePlayer";
import { getDisplayTimeBySeconds } from "../helper/utils.ts";
import { Slider, LinearProgress } from "@mui/material";
import { Loop } from "../store/player.ts";

export default function Player() {
  const {
    play,
    pause,
    currentTime,
    duration,
    changeVolume,
    changeLoop,
    volume,
    buffer,
    nextSong,
    preSong,
    isPlayerReady,
    playerInit,
    isMute,
    changeIsMute,
    onSeek,
    onSeekFinished,
    loop,
    isLoading,
    isPlaying,
  } = usePlayer();

  const playerRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    playerInit(playerRef.current!);
  }, []);
  return (
    <div className="h-[300px]">
      {!isPlayerReady && <span>player is not ready</span>}
      <audio ref={playerRef as LegacyRef<HTMLAudioElement>} />
      <div className="flex flex-col gap-2 h-full">
        <button onClick={() => play()}>play</button>
        <button onClick={pause}>pause</button>
        <button onClick={changeLoop}>
          {loop === Loop.noLoop
            ? "no loop"
            : loop === Loop.allSong
            ? "all song"
            : "single song"}
        </button>
        <button onClick={nextSong}>next</button>
        <button onClick={preSong}>pre</button>
        <button onClick={changeIsMute}>{isMute ? "dont mute" : "mute"}</button>
        <span>{buffer}</span>
        <span>{isLoading ? "loading" : "finished"}</span>
        <span>{isPlaying ? "playing" : "not playing"}</span>

        <span>current: {getDisplayTimeBySeconds(currentTime)}</span>
        <span>duration: {getDisplayTimeBySeconds(duration)}</span>
        <Slider
          value={currentTime}
          max={duration}
          onChange={(_, v) => {
            onSeek(v as number);
          }}
          onChangeCommitted={() => {
            onSeekFinished();
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
