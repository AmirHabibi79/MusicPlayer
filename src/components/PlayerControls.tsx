import usePlayer from "../hooks/usePlayer";
import { Loop } from "../store/player";
import VolumeSlider from "./VolumeSlider";
import CurrentTimeSlider from "./CurrentTimeSlider";
import { getDisplayTimeBySeconds } from "../helper/utils";
import { TbRepeat, TbRepeatOff, TbRepeatOnce } from "react-icons/tb";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";

export default function PlayerControls() {
  const {
    play,
    pause,
    changeLoop,
    loop,
    nextSong,
    preSong,
    // isLoading,
    isPlaying,
    selected,
    currentTime,
    duration,
    buffer,
  } = usePlayer();
  return (
    <>
      {selected !== null && (
        <IconContext.Provider value={{ size: "20" }}>
          <div className="flex flex-col p-2 bg-[#DFDFDF] rounded-sm">
            <div className="flex flex-col items-center">
              <img
                className="w-[100px] h-[100px] rounded-sm "
                src={selected?.Cover}
                alt={selected?.Name}
              />
              <span className="font-bold text-lg ">{selected?.Name}</span>
              <span className="font-light text-sm ">{selected?.Artist}</span>
            </div>
            <div className="flex flex-col px-2">
              <CurrentTimeSlider />
              <div className="flex items-center justify-between mt-1">
                <span className="font-extralight text-sm  self-end">
                  {getDisplayTimeBySeconds(currentTime)}
                </span>

                <span className="font-extralight text-sm self-end">
                  {getDisplayTimeBySeconds(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2 self-center ">
                <button
                  onClick={(e) => {
                    e.currentTarget.blur();
                    preSong();
                  }}
                >
                  <BiSkipPrevious size={40} />
                </button>
                {isPlaying ? (
                  <button
                    onClick={(e) => {
                      e.currentTarget.blur();
                      pause();
                    }}
                  >
                    <IoPauseCircle size={60} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.currentTarget.blur();
                      play();
                    }}
                  >
                    <IoPlayCircle size={60} />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.currentTarget.blur();
                    nextSong();
                  }}
                >
                  <BiSkipNext size={40} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <VolumeSlider />

                {/* <button onClick={pause}>pause</button> */}
                <button
                  onClick={(e) => {
                    e.currentTarget.blur();
                    changeLoop();
                  }}
                >
                  {loop === Loop.noLoop ? (
                    <TbRepeatOff />
                  ) : loop === Loop.allSong ? (
                    <TbRepeat />
                  ) : (
                    <TbRepeatOnce />
                  )}
                </button>
                {/* <span>{isLoading ? "loading" : "finished"}</span>
      <span>{isPlaying ? "playing" : "not playing"}</span> */}
              </div>
            </div>
          </div>
        </IconContext.Provider>
      )}
    </>
  );
}
