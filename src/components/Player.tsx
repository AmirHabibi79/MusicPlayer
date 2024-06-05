/* eslint-disable react-hooks/exhaustive-deps */
import { LegacyRef, useRef, useEffect, useState } from "react";
import usePlayer from "../hooks/usePlayer";
import PlayerControls from "./PlayerControls.tsx";

export default function Player() {
  const { playerInit } = usePlayer();
  const playerRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    playerInit(playerRef.current!);
  }, []);

  return (
    <div className="h-[500px]">
      <audio ref={playerRef as LegacyRef<HTMLAudioElement>} />
      <div className="flex  gap-2 h-full">
        <div className="flex flex-col gap-1">
          <h1>keyboard shortcut</h1>
          <span>space : play/pause</span>
          <span>n : next song</span>
          <span>p : previous song</span>
          <span>m : nute</span>
          <span>l : loop</span>

          <span>arrow up : volume up</span>
          <span>arrow down : volume down</span>
          <span>arrow right : skip +5s</span>
          <span>arrow left : skip -5s</span>
        </div>
        <PlayerControls />
      </div>
    </div>
  );
}
