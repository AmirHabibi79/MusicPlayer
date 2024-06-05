/* eslint-disable @typescript-eslint/no-explicit-any */
//also install types for lodash
import _ from "lodash";
import { gsap } from "gsap";

const addHeadingZero = (num: number): string => {
  return num > 9 ? num.toString() : `0${num}`;
};

export const getDisplayTimeBySeconds = (seconds: number): string | null => {
  if (!isFinite(seconds)) {
    return null;
  }

  const min = Math.floor(seconds / 60);
  // const minStr = addHeadingZero(min);
  const secStr = addHeadingZero(Math.floor(seconds % 60));
  const minStrForHour = addHeadingZero(Math.floor(min % 60));
  const hourStr = Math.floor(min / 60);

  // const mmSs = `${minStr}:${secStr}`;
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
export const getType = (value: unknown) => {
  return Object.prototype.toString
    .call(value)
    .replace(/^\[object |\]$/g, "")
    .toLowerCase();
};

export const checkType = (receivedValue: any, expectedType: any) => {
  const received = getType(receivedValue);
  if (received === "undefined") {
    throw new TypeError("receivedValue is undefined ");
  }
  if (received !== expectedType) {
    throw new TypeError("expected " + expectedType + "; received " + received);
  }
};

export function getUniqArray<T>(arr: Array<T>, by: string) {
  return _.uniqBy(arr, by);
}

export const cloneDeep = (obj: any) => {
  return _.cloneDeep(obj);
};
export const makeUniqId = (concat?: string) => {
  return concat === undefined ? _.uniqueId() : _.uniqueId(concat);
};
export const throttle = (fn: (...args: any) => any, wait: number) => {
  return _.throttle(fn, wait, { leading: true, trailing: true });
};
const ease = "circ.out";
export const fadeIn = (
  player: HTMLAudioElement,
  volume: number,
  onComplete?: () => void
) => {
  gsap.to(player, { volume: volume, onComplete: onComplete, ease: ease });
};
export const fadeOut = (player: HTMLAudioElement, onComplete?: () => void) => {
  gsap.to(player, { volume: 0, onComplete: onComplete, ease: ease });
};
