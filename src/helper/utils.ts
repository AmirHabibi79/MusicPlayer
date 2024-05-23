const addHeadingZero = (num: number): string => {
  return num > 9 ? num.toString() : `0${num}`;
};

export const getDisplayTimeBySeconds = (seconds: number): string | null => {
  if (!isFinite(seconds)) {
    return null;
  }

  const min = Math.floor(seconds / 60);
  const minStr = addHeadingZero(min);
  const secStr = addHeadingZero(Math.floor(seconds % 60));
  const minStrForHour = addHeadingZero(Math.floor(min % 60));
  const hourStr = Math.floor(min / 60);

  const mmSs = `${minStr}:${secStr}`;
  const hhMmSs = `${hourStr}:${minStrForHour}:${secStr}`;

  return hhMmSs;
  //   if (timeFormat === "auto") {
  //     if (totalSeconds >= 3600) {
  //       return hhMmSs;
  //     } else {
  //       return mmSs;
  //     }
};
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
