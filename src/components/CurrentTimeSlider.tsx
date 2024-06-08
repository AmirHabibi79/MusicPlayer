import { LinearProgress, Slider } from "@mui/material";
import usePlayer from "../hooks/usePlayer";

export default function CurrentTimeSlider() {
  const { currentTime, duration, onSeek, onSeekFinished, buffer } = usePlayer();

  return (
    <div className="h-[20px] flex flex-shrink-0 flex-grow items-center relative">
      <Slider
        value={currentTime}
        max={duration}
        onChange={(_, v) => {
          onSeek(v as number);
        }}
        onChangeCommitted={() => {
          onSeekFinished();
        }}
        sx={{
          "& .MuiSlider-rail": {
            color: "transparent",
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
      />
      <div className="w-full absolute">
        <LinearProgress
          variant="determinate"
          value={buffer}
          sx={{
            backgroundColor: "#eeeee4",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#bebeb6",
            },
          }}
        />
      </div>
    </div>
  );
}
