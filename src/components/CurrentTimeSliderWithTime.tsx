import CurrentTimeSlider from "./CurrentTimeSlider";
import { getDisplayTimeBySeconds } from "../helper/utils";
import usePlayer from "../hooks/usePlayer";
type Props = { under: boolean };
export default function CurrentTimeSliderWithTime({ under }: Props) {
  const { currentTime, duration } = usePlayer();
  return (
    <>
      {under ? (
        <>
          <CurrentTimeSlider />
          <div className="flex items-center justify-between mt-1">
            <span className="font-extralight text-sm  self-start">
              {getDisplayTimeBySeconds(currentTime)}
            </span>

            <span className="font-extralight text-sm self-end">
              {getDisplayTimeBySeconds(duration)}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex items-center gap-4 ">
            <span className="font-extralight text-sm">
              {getDisplayTimeBySeconds(currentTime)}
            </span>

            <CurrentTimeSlider />
            <span className="font-extralight text-sm">
              {getDisplayTimeBySeconds(duration)}
            </span>
          </div>
        </>
      )}
    </>
  );
}
