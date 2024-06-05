import { Slider } from "@mui/material";
import React from "react";
import usePlayer from "../hooks/usePlayer";
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

export default function VolumeSlider() {
  const { volume, changeVolume, changeIsMute, isMute } = usePlayer();
  return (
    <div className="h-[20px]  w-[120px] flex  items-center gap-3 ">
      <button
        onClick={(e) => {
          e.currentTarget.blur();
          changeIsMute();
        }}
      >
        {isMute ? <IoVolumeMute /> : <IoVolumeHigh />}
      </button>
      <Slider
        value={volume}
        onChange={(_, v) => {
          changeVolume(v as number);
        }}
        //TODO:fix the rail color
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
        // orientation="vertical"
      />
    </div>
  );
}
