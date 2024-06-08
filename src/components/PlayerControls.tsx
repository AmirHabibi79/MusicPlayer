import usePlayer from "../hooks/usePlayer";
import { Loop } from "../store/player";
import VolumeSlider from "./VolumeSlider";
import { TbRepeat, TbRepeatOff, TbRepeatOnce } from "react-icons/tb";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import CurrentTimeSliderWithTime from "./CurrentTimeSliderWithTime";
export default function PlayerControls() {
  const {
    play,
    pause,
    changeLoop,
    loop,
    nextSong,
    preSong,
    isPlaying,
    selected,
  } = usePlayer();
  const is640px = useMediaQuery("(min-width:640px)");
  const [isDown, setIsDown] = useState(is640px);
  const onClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    callback: () => void
  ) => {
    e.currentTarget.blur();
    callback();
  };
  return (
    <>
      {selected !== null && (
        <IconContext.Provider value={{ size: "20" }}>
          <button
            onClick={() => {
              setIsDown(true);
            }}
            className={`${
              isDown ? "hidden" : "block"
            } absolute top-2 left-2 z-10`}
          >
            <MdOutlineKeyboardArrowDown size={30} />
          </button>
          <div
            className={`  absolute flex justify-between bg-[#DFDFDF] ${
              isDown
                ? "h-[50px] bottom-2 w-[calc(100%-20px)] rounded-3xl mx-auto flex-row p-2 items-center"
                : " w-full h-full  left-0 top-0  flex-col  p-4  rounded-sm"
            }`}
          >
            <div
              onClick={
                !is640px
                  ? () => {
                      setIsDown(false);
                    }
                  : () => {}
              }
              className={`flex items-center ${
                isDown
                  ? "mt-0 flex-row gap-1 cursor-pointer sm:cursor-default"
                  : "flex-col  mt-40 "
              }  `}
            >
              <img
                className={`${
                  isDown
                    ? "w-[40px] h-[40px] rounded-full"
                    : "w-[150px] h-[150px] rounded-sm"
                } `}
                src={selected?.Cover}
                alt={selected?.Name}
              />
              <div className="flex flex-col items-center">
                <span className={`${isDown && "text-base"} font-bold text-lg`}>
                  {selected?.Name}
                </span>
                <span className="font-light text-sm ">{selected?.Artist}</span>
              </div>
            </div>
            <div
              className={`flex  flex-col px-2 sm:flex-row sm:gap-2 md:gap-4`}
            >
              <div
                className={`${
                  isDown ? "hidden" : "flex flex-col"
                }  sm:flex sm:w-[300px] lg:w-[400px] `}
              >
                <CurrentTimeSliderWithTime under={!isDown} />
              </div>
              <div className="flex items-center gap-2 self-center ">
                <button
                  onClick={(e) => {
                    onClick(e, preSong);
                  }}
                >
                  <BiSkipPrevious size={isDown ? 30 : 40} />
                </button>
                {isPlaying ? (
                  <button
                    onClick={(e) => {
                      onClick(e, pause);
                    }}
                  >
                    <IoPauseCircle size={isDown ? 40 : 60} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      onClick(e, play);
                    }}
                  >
                    <IoPlayCircle size={isDown ? 40 : 60} />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    onClick(e, nextSong);
                  }}
                >
                  <BiSkipNext size={isDown ? 30 : 40} />
                </button>
              </div>
              <div
                className={`${
                  isDown ? "hidden" : "flex"
                } sm:hidden sm:justify-normal md:flex md:gap-3 items-center justify-between `}
              >
                <VolumeSlider />

                <button
                  onClick={(e) => {
                    onClick(e, changeLoop);
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
              </div>
            </div>
          </div>
        </IconContext.Provider>
      )}
    </>
  );
}
