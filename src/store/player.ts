import { atom } from "recoil";
export enum Loop {
  noLoop,
  allSong,
  singleSong,
}
const isPlayerInit = atom({
  key: "isPlayerInit",
  default: false,
});
const isPlayerReady = atom({
  key: "playerReady",
  default: false,
});
const playerElement = atom<HTMLAudioElement | null>({
  key: "playerElement",
  default: null,
});
const isPlaying = atom({
  key: "isplaying",
  default: false,
});
const currentTime = atom({
  key: "currentTime",
  default: 0,
});
const duration = atom({
  key: "duration",
  default: 0,
});
const loop = atom<Loop>({
  key: "loop",
  default: Loop.noLoop,
});
const isSeeking = atom({
  key: "isseeking",
  default: false,
});
const isLoading = atom({
  key: "isloading",
  default: false,
});
const volume = atom({
  key: "volume",
  default: 0.5,
});
const isMute = atom({
  key: "isMute",
  default: false,
});
const buffer = atom({
  key: "buffer",
  default: 0,
});
export {
  isPlaying,
  currentTime,
  duration,
  loop,
  isSeeking,
  volume,
  buffer,
  playerElement,
  isPlayerReady,
  isPlayerInit,
  isMute,
  isLoading,
};
