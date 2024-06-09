import { Slider } from "@mui/material";
import usePlayer from "../hooks/usePlayer";
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { RefObject, useRef } from "react";

export default function VolumeSlider() {
  const { volume, changeVolume, changeIsMute, isMute } = usePlayer();
  const sliderRef = useRef<HTMLSpanElement>() as RefObject<HTMLSpanElement>;

  return (
    <div className="h-[20px]  w-[120px] flex  items-center gap-3 ">
      <button
        onClick={() => {
          changeIsMute();
        }}
      >
        {isMute ? <IoVolumeMute /> : <IoVolumeHigh />}
      </button>
      <Slider
        ref={sliderRef}
        value={volume}
        onChange={(_, v) => {
          changeVolume(v as number);
        }}
        onChangeCommitted={() => {
          console.log(sliderRef.current);
          sliderRef.current?.blur();
        }}
        sx={{
          "& .MuiSlider-rail": {
            color: "#eeeee4",
          },
          "& .MuiSlider-thumb": {
            color: "black",
            zIndex: "10",
          },
          "& .MuiSlider-thumb:hover": {
            boxShadow: "0 0 0 8px rgba(0,0,0,0.1)",
          },
          //when draging
          "& .MuiSlider-thumb.Mui-active": {
            boxShadow: "0 0 0 14px rgba(0,0,0,0.1) !important",
          },
          //when has focus
          "& .MuiSlider-thumb.Mui-focusVisible": {
            boxShadow: "0 0 0 8px rgba(0,0,0,0.1)",
          },
          "& .MuiSlider-track": {
            zIndex: "10",
            color: "black",
          },
        }}
        min={0}
        step={0.1}
        max={1}
        size="small"
      />
    </div>
  );
}
